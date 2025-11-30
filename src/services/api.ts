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
    const response = await api.get(`/profile?phoneNumber=${encodedPhone}`);
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

export const uploadVideo = async (
  videoUri: string,
  phoneNumber: string,
  metadata?: {
    title: string;
    description: string;
    category: string;
    tags: string[];
  },
) => {
  const formData = new FormData();
  // Append text fields FIRST so backend can read them before the file
  formData.append('phoneNumber', phoneNumber);

  if (metadata) {
    formData.append('title', metadata.title);
    formData.append('description', metadata.description);
    formData.append('category', metadata.category);
    formData.append('tags', JSON.stringify(metadata.tags));
  }

  formData.append('video', {
    uri: videoUri,
    type: 'video/mp4',
    name: 'video.mp4',
  });

  try {
    const response = await api.post('/profile/upload-video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error (uploadVideo):', error);
    throw error;
  }
};

export default api;
