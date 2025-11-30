import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  phoneNumber: string;
  name: string;
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

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserStart: state => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<Partial<User>>) => {
      state.loading = false;
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearUser: state => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setUser,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  clearUser,
} = userSlice.actions;
export default userSlice.reducer;
