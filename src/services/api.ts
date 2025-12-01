import axios from 'axios';
import auth from '@react-native-firebase/auth';

// Use 10.0.2.2 for Android Emulator
// For physical device, use your machine's IP address
const BASE_URL = 'http://192.168.29.157:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the Firebase Auth token
api.interceptors.request.use(
  async config => {
    const user = auth().currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      config.params || '',
    );
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const getProfile = async (phoneNumber: string) => {
  try {
    const encodedPhone = encodeURIComponent(phoneNumber);
    const response = await api.get(
      `/profile?phoneNumber=${encodedPhone}&type=worker`,
    );
    return response.data;
  } catch (error) {
    console.error('API Error (getProfile):', error);
    throw error;
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await api.post('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('API Error (updateProfile):', error);
    throw error;
  }
};

export const uploadImage = async (imageUri: string, phoneNumber: string) => {
  try {
    const formData = new FormData();
    // Append text fields FIRST so backend can read them before the file
    formData.append('phoneNumber', phoneNumber);

    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust based on actual image type if needed
      name: 'profile.jpg',
    });

    const response = await api.post('/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error (uploadImage):', error);
    throw error;
  }
};

// ===== Work Video APIs =====
// ===== Work Video APIs =====

export const createWorkVideo = async (videoData: {
  userId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
}) => {
  try {
    const response = await api.post('/work-videos', videoData);
    return response.data;
  } catch (error) {
    console.error('API Error (createWorkVideo):', error);
    throw error;
  }
};

export const getMyWorkVideos = async (userId: string) => {
  try {
    const response = await api.get(`/work-videos/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('API Error (getMyWorkVideos):', error);
    throw error;
  }
};

export const getWorkVideo = async (videoId: string) => {
  try {
    const response = await api.get(`/work-videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('API Error (getWorkVideo):', error);
    throw error;
  }
};

export const updateWorkVideo = async (
  videoId: string,
  updates: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
  },
) => {
  try {
    const response = await api.put(`/work-videos/${videoId}`, updates);
    return response.data;
  } catch (error) {
    console.error('API Error (updateWorkVideo):', error);
    throw error;
  }
};

export const deleteWorkVideo = async (videoId: string) => {
  try {
    const response = await api.delete(`/work-videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('API Error (deleteWorkVideo):', error);
    throw error;
  }
};

export const incrementVideoViews = async (videoId: string) => {
  try {
    const response = await api.post(`/work-videos/${videoId}/view`);
    return response.data;
  } catch (error) {
    console.error('API Error (incrementVideoViews):', error);
    throw error;
  }
};

export default api;
