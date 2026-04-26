import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig,
  AxiosResponse 
} from 'axios';

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// 1. Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// 2. Queue Logic for Refresh Token concurrency
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};


// 3. Create Axios Instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for Cookies
});


// 4. Request Interceptor (Attaches Token)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken') || localStorage.getItem('token')
        : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);


// 5. Response Interceptor (Handles Errors & Refresh)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // A. Handle Network Errors
    if (!error.response) {
      return Promise.reject(new Error("Network error. Please check your connection."));
    }

    // B. Handle 401 Unauthorized (Refresh Logic)
      if (error.response.status === 401 && !originalRequest._retry) {
      
      // Avoid infinite loop if the refresh endpoint itself fails
      if (originalRequest.url?.includes('/refresh-token')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // We can't use apiClient here to avoid circular interceptors, 
        // but we can use a raw axios call or a dedicated instance.
        // Assuming your refresh logic relies on a cookie or a stored refresh token:
        
        // Option A: If using LocalStorage for refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });

        // Option B: If using HttpOnly cookies, just call the endpoint:
        // const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });

        // Save new token
        const newAccessToken = data?.data?.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        // If your backend rotates refresh tokens, save that too:
        if (data?.data?.refreshToken) localStorage.setItem('refreshToken', data.data.refreshToken);

        // Process queue
        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        // Logout if refresh fails
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
             window.location.href = '/login'; 
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // C. Return clean error message
    const backendError = (error.response.data as any)?.error;
    const message =
      backendError ||
      error.response.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;