// utils/auth.js
export const getAuthToken = () => {
    const storedUser = sessionStorage.getItem("userInfo");

    if (!storedUser) {
        throw new Error("User is not authenticated");
    }

    try {
        const userInfo = JSON.parse(storedUser);

        if (!userInfo?.token) {
            throw new Error("Token not found");
        }

        return userInfo.token;
    } catch (error) {
        throw new Error("Invalid user data in session storage");
    }
};
