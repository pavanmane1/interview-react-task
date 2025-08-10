
import apiClient from '../../config/apiClient';


const usserService = {
    getAllUsers: async () => {
        try {
            // Get stored user info from sessionStorage
            const storedUser = sessionStorage.getItem('userInfo');
            const userInfo = JSON.parse(storedUser);

            // Prepare request body with token
            const requestBody = {
                token: userInfo.token
            };

            // Make API request
            const response = await apiClient.get("user-list", requestBody);

            console.log(response.data);
            return response?.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    getState: async (countyId) => {
        try {
            const storedUser = sessionStorage.getItem('userInfo');
            const userInfo = JSON.parse(storedUser);
            const response = await apiClient.get("state-list", {
                params: {
                    country_id: countyId,
                    token: userInfo.token,
                },
            });

            return response?.data;
        } catch (error) {
            console.error("Error fetching states:", error);
            throw error;
        }
    },

    getCountry: async () => {
        try {
            // Get stored user info from sessionStorage
            const storedUser = sessionStorage.getItem('userInfo');
            const userInfo = JSON.parse(storedUser);

            // Prepare request body with token
            const requestBody = {
                token: userInfo.token
            };

            // Make API request
            const response = await apiClient.get("country-list", requestBody);

            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    addUsers: async (userData) => {
        try {
            const storedUser = sessionStorage.getItem("userInfo");

            const userInfo = JSON.parse(storedUser);

            const formData = new FormData();
            formData.append("token", userInfo.token);
            formData.append("name", userData.personalDetails.name);
            formData.append("gender", userData.personalDetails.gender);
            formData.append("phoneNumber", userData.personalDetails.phoneNumber);

            // Handle profile image if exists
            if (userData.personalDetails.profileImage) {
                formData.append("photo", userData.personalDetails.profileImage);
            }

            // Append country details
            formData.append("countryId", userData.countryDetails.country.value);
            formData.append("stateId", userData.countryDetails.state.value);

            // Append credential details
            formData.append("email", userData.credentialDetails.email);
            formData.append("password", userData.credentialDetails.password);
            formData.append("password_confirmation", userData.credentialDetails.confirmPassword);

            // Handle skills array
            if (userData.skillsDetails.skills && userData.skillsDetails.skills.length > 0) {
                formData.append("skills", userData.skillsDetails.skills.join(','));
            }


            // Send request
            const response = await apiClient.post("register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data;
        } catch (error) {
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            throw error;
        }
    },
    deleteUser: async (userId) => {
        try {
            const storedUser = sessionStorage.getItem("userInfo");
            const userInfo = JSON.parse(storedUser);
            const response = await apiClient.post(`user-delete/${userId}`, {
                tocken: userInfo.tocken
            });

            console.log("Delete Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error deleting product:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            throw error;
        }
    },



    getProductsByPage: async (nextpageUrl) => {
        try {
            // Get stored user info from sessionStorage
            const storedUser = sessionStorage.getItem('userInfo');
            const userInfo = JSON.parse(storedUser);

            const requestBody = {
                token: userInfo.token
            };

            // Make API request
            const response = await apiClient.get("product-list", requestBody);

            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }
};



export default usserService;