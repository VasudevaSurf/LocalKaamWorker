import axios from 'axios';
import auth from '@react-native-firebase/auth';

// Use 10.0.2.2 for Android Emulator
// For physical device, use your machine's IP address
const BASE_URL = 'https://localkaamserver-lpvt.onrender.com/api';

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

// Add a response interceptor for global retries
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;

    // If we have no config, or it's not a network/ 5xx error, reject
    if (
      !config ||
      (!error.message.includes('Network Error') &&
        !error.message.includes('timeout') &&
        error.response?.status !== 503)
    ) {
      return Promise.reject(error);
    }

    // Set retry count
    config.retryCount = config.retryCount || 0;

    // Check if we've maxed out retries
    if (config.retryCount >= 3) {
      return Promise.reject(error);
    }

    // Increase retry count
    config.retryCount += 1;

    // Create a new promise to handle the backoff
    const backoff = new Promise(resolve => {
      setTimeout(() => {
        resolve(null);
      }, 1000 * config.retryCount); // 1s, 2s, 3s wait
    });

    console.log(
      `[API] Retrying request ${config.url} (Attempt ${config.retryCount})...`,
    );

    // Wait for backoff, then retry
    await backoff;
    return api(config);
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

export const getWorkerProfile = async (userId: string) => {
  try {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker profile:', error);
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
    const response = await api.post('/work-videos', {
      ...videoData,
      userId: videoData.workerId,
      category: videoData.serviceType,
    });
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

// Complete Job API
export const completeJob = async (
  requestId: string,
  otp: string,
  completionVideo: string,
  workerId: string,
) => {
  try {
    const response = await api.post(`/service-requests/${requestId}/complete`, {
      otp,
      completionVideo,
      workerId,
    });
    return response.data;
  } catch (error) {
    console.error('Error completing job:', error);
    throw error;
  }
};

// Cancel/Forfeit Job API
export const cancelJob = async (requestId: string, workerId: string) => {
  try {
    const response = await api.post(
      `/service-requests/${requestId}/cancel-job`,
      {
        workerId,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling job:', error);
    throw error;
  }
};

// Earnings Report
export const getWorkerStats = async (workerId: string) => {
  try {
    const response = await api.get(
      `/service-requests/worker-stats/${workerId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching worker stats:', error);
    throw error;
  }
};

// Reviews
export const getWorkerReviews = async (workerId: string) => {
  try {
    const response = await api.get(`/profile/reviews/${workerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker reviews:', error);
    throw error;
  }
};

// FCM Token
export const updateFcmToken = async (userId: string, fcmToken: string) => {
  try {
    const response = await api.put('/profile/fcm-token', {
      userId,
      fcmToken,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating FCM token:', error);
    // Don't throw, just log
  }
};

export default api;
