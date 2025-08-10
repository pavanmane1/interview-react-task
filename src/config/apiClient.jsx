import axios from 'axios';
import config from './config';


const getToken = () => {
    try {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        return userInfo?.token || null;
    } catch (error) {
        console.error("Error parsing userInfo:", error);
        return null;
    }
};

const apiClient = axios.create({
    baseURL: config.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request Interceptor → Attach token
apiClient.interceptors.request.use(
    (reqConfig) => {
        const token = getToken();
        if (token) {
            reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor → Handle common API errors
apiClient.interceptors.response.use(
    (response) => {
        // Handle API-specific error formats
        if (response.data?.success === false) {
            return Promise.reject({
                message: response.data.message || "Something went wrong",
                response: response
            });
        }
        return response;
    },
    (error) => {
        let errorMessage = "Network Error";

        if (error.response) {
            const { status, data } = error.response;

            // Handle API-specific error formats
            if (typeof data === 'string') {
                errorMessage = data;
            } else if (data?.message) {
                errorMessage = data.message;
            } else if (data?.error) {
                errorMessage = data.error;
            } else {
                errorMessage = "Something went wrong";
            }

            // Handle Unauthorized
            if (status === 401) {
                sessionStorage.removeItem('userInfo');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            errorMessage = error.message;
        }

        return Promise.reject({ message: errorMessage });
    }
);

export default apiClient;