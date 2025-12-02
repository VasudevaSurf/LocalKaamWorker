import axios from 'axios';
import auth from '@react-native-firebase/auth';

// Use 10.0.2.2 for Android Emulator
// For physical device, use your machine's IP address
const BASE_URL = 'https://localkaamserver.onrender.com/api';

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

export const uploadImage = async (
  imageUri: string,
  folder: string = 'profiles',
) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);
    formData.append('folder', folder);

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

export const uploadWorkVideo = async (videoData: {
  workerId: string;
  workerName: string;
  serviceType: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
}) => {
  try {
    const response = await api.post('/work-videos', videoData);
    return response.data;
  } catch (error) {
    console.error('API Error (uploadWorkVideo):', error);
    throw error;
  }
};

export const getWorkerVideos = async (workerId: string) => {
  try {
    const response = await api.get(`/work-videos/user/${workerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker videos:', error);
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

// Service Request APIs
export const getPendingRequests = async (
  serviceType?: string,
  workerId?: string,
) => {
  try {
    const params: any = {};
    if (serviceType) params.serviceType = serviceType;
    if (workerId) params.workerId = workerId;

    const response = await api.get('/service-requests/pending', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    throw error;
  }
};

export const getWorkerActiveRequests = async (workerId: string) => {
  try {
    const response = await api.get(
      `/service-requests/worker/active/${workerId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching worker active requests:', error);
    throw error;
  }
};

export const getServiceRequestById = async (requestId: string) => {
  try {
    const response = await api.get(`/service-requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service request:', error);
    throw error;
  }
};

// Quote APIs
export const submitQuote = async (quoteData: {
  serviceRequestId: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  quotedPrice: number;
  message?: string;
}) => {
  try {
    const response = await api.post('/quotes', quoteData);
    return response.data;
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
};

export const getWorkerQuotes = async (workerId: string) => {
  try {
    const response = await api.get(`/quotes/worker/${workerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker quotes:', error);
    throw error;
  }
};

export default api;
