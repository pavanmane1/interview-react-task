import apiClient from '../../config/apiClient';

const authService = {
    login: async (credentials) => {
        try {
            const response = await apiClient.post("login", {
                email: credentials.username,
                password: credentials.password,
            });
            console.log(response.data)
            // Return the full API response
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    getUserInfo: () => {
        const userInfo = sessionStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    },
};

export default authService;