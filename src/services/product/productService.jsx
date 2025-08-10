
import apiClient from '../../config/apiClient';


const productService = {
    getAllProducts: async () => {
        try {
            // Get stored user info from sessionStorage
            const storedUser = sessionStorage.getItem('userInfo');
            const userInfo = JSON.parse(storedUser);

            // Prepare request body with token
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
    },
    addProduct: async (productData) => {
        try {
            const storedUser = sessionStorage.getItem("userInfo");
            const userInfo = JSON.parse(storedUser);

            // Create FormData object
            const formData = new FormData();
            formData.append("token", userInfo.token);
            formData.append("name", productData.get("name"));
            formData.append("description", productData.get("description"));
            formData.append("price", productData.get("price"));
            formData.append("image", productData.get("image"));

            // Send request
            const response = await apiClient.post("add-product", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data;

        } catch (error) {
            // Log detailed error information
            console.error("Error details:", {
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



export default productService;