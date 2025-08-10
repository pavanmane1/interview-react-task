import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.jsx'
import productReducer from '../features/product/productSlice.jsx'
import userReducer from '../features/user/userSlice.jsx'
import confirmReducer from '../features/confirm/confirmSlice.jsx'
const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        user: userReducer,
        confirm: confirmReducer
    },
});

export default store;
