import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from '../store/slices/authSlice';
import {
  setUser,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  clearUser,
} from '../store/slices/userSlice';
import { cache } from '../utils/cache';

interface User {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  phoneNumber: string; // Changed from phone to phoneNumber to match backend
  skill: string;
  profileComplete: boolean;
  profileImage?: string;
  profileVideo?: string;
  city?: {
    name: string;
    state: string;
  };
  experience?: {
    label: string;
    value: string;
  };
  workVideos?: {
    videoUrl: string;
    thumbnailUrl?: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    createdAt: string;
  }[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  uploadUserImage: (imageUri: string) => Promise<string>;
  uploadUserVideo: (
    videoUri: string,
    metadata?: {
      title: string;
      description: string;
      category: string;
      tags: string[];
    },
  ) => Promise<string>;
  checkAuthStatus: () => Promise<boolean>;
  setOnboardingComplete: () => Promise<void>;
  refreshUserProfile: (forceRefresh?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const { currentUser: user } = useAppSelector(state => state.user);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
    // Refresh profile on app start if user is logged in
    if (user?.phoneNumber) {
      refreshUserProfile();
    }
  }, []);

  const refreshUserProfile = async (forceRefresh: boolean = false) => {
    try {
      if (user?.phoneNumber) {
        const cacheKey = `user_profile_${user.phoneNumber}`;

        // Try to get from cache first if not forced
        if (!forceRefresh) {
          const cachedUser = await cache.get<User>(cacheKey);
          if (cachedUser) {
            console.log('[AuthContext] Using cached user profile');
            dispatch(setUser(cachedUser));
            return;
          }
        }

        // If forced, not in cache, or expired, fetch from API
        console.log(
          `[AuthContext] Fetching user profile from API (Force: ${forceRefresh})`,
        );
        const updatedUser = await api.getProfile(user.phoneNumber);
        if (updatedUser) {
          // Map MongoDB _id to id
          const mappedUser = {
            ...updatedUser,
            id: updatedUser._id || updatedUser.id,
          };
          await cache.set(cacheKey, mappedUser);
          dispatch(setUser(mappedUser));
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem(
        '@onboarding_complete',
      );
      setHasSeenOnboarding(onboardingComplete === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    // Redux Persist handles this automatically
    return isAuthenticated;
  };

  const setOnboardingComplete = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Error setting onboarding complete:', error);
    }
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    try {
      dispatch(loginStart());
      // Fetch user profile from backend
      try {
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        const cacheKey = `user_profile_${formattedPhone}`;

        // Check cache first
        const cachedUser = await cache.get<User>(cacheKey);
        if (cachedUser) {
          console.log('[AuthContext] Login: User found in cache');
          // Map MongoDB _id to id for cached user too
          const mappedUser = {
            ...cachedUser,
            id: cachedUser._id || cachedUser.id,
          };
          dispatch(setUser(mappedUser));
          dispatch(loginSuccess('mock_token_123'));
          return true;
        }

        const existingUser = await api.getProfile(formattedPhone);
        if (existingUser) {
          console.log('User found:', existingUser);
          // Map MongoDB _id to id
          const mappedUser = {
            ...existingUser,
            id: existingUser._id || existingUser.id,
          };
          await cache.set(cacheKey, mappedUser);
          dispatch(setUser(mappedUser));
          dispatch(loginSuccess('mock_token_123'));
          return true;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.log('User not found in DB, proceeding to setup new profile.');
        } else {
          console.error('Error fetching profile:', error);
        }
      }

      const userData: User = {
        id: '123',
        name: '',
        phoneNumber: phone,
        skill: '',
        profileComplete: false,
      };

      dispatch(loginSuccess('mock_token_123'));
      dispatch(setUser(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      dispatch(loginFailure('Login failed'));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (user?.phoneNumber) {
        await cache.remove(`user_profile_${user.phoneNumber}`);
      }
      dispatch(logoutAction());
      dispatch(clearUser());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) return;
      dispatch(updateUserStart());

      const updatedProfile = await api.updateProfile({
        ...userData,
        phoneNumber: user.phoneNumber,
        firebaseUid: auth().currentUser?.uid || '',
        userType: 'worker',
      });

      const mappedUser = {
        ...updatedProfile,
        id: updatedProfile._id || updatedProfile.id,
      };

      // Update cache with new data from backend
      const cacheKey = `user_profile_${user.phoneNumber}`;
      await cache.set(cacheKey, mappedUser);

      dispatch(updateUserSuccess(mappedUser));
    } catch (error) {
      console.error('Update user error:', error);
      dispatch(updateUserFailure('Update failed'));
      throw error;
    }
  };

  const uploadUserImage = async (imageUri: string): Promise<string> => {
    try {
      if (!user) throw new Error('User not logged in');
      const response = await api.uploadImage(imageUri, user.phoneNumber);

      // Update cache
      const cacheKey = `user_profile_${user.phoneNumber}`;
      const currentUserData = (await cache.get<User>(cacheKey)) || user;
      const newUserData = {
        ...currentUserData,
        profileImage: response.imageUrl,
      };
      await cache.set(cacheKey, newUserData);

      dispatch(updateUserSuccess({ profileImage: response.imageUrl }));

      return response.imageUrl;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  };

  const uploadUserVideo = async (videoUri: string): Promise<string> => {
    try {
      if (!user) throw new Error('User not logged in');

      // Upload video to Firebase Storage
      const storage = require('@react-native-firebase/storage').default;
      const reference = storage().ref(
        `work_videos/${user.phoneNumber}-${Date.now()}.mp4`,
      );

      await reference.putFile(videoUri);
      const videoUrl = await reference.getDownloadURL();

      return videoUrl;
    } catch (error) {
      console.error('Upload video error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        hasSeenOnboarding,
        login,
        logout,
        updateUser,
        uploadUserImage,
        uploadUserVideo,
        checkAuthStatus,
        setOnboardingComplete,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
