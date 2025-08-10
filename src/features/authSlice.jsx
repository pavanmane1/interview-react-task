import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/auth/authService';
import { handleAsyncActions } from '../utils/functions/reduxSlice';
import { jwtDecode } from "jwt-decode";
// Extract expiry timestamp from JWT token (Unix seconds)
function getTokenExpiry(token) {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp || null;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
}

// Login User
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await authService.login(credentials);

            if (res.success && res.token) {
                const expiry = getTokenExpiry(res.token);

                const userInfo = {
                    token: res.token,
                    role: res.role,
                    expiry,
                };

                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                return userInfo;
            } else {
                return rejectWithValue(res.message || 'Login failed');
            }

        } catch (error) {
            let errorMessage = 'Login failed';

            if (error?.message) {
                errorMessage = error.message;
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            return rejectWithValue(errorMessage);
        }
    }
);

// Restore Session on page refresh
export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (_, { dispatch }) => {
        const storedUser = sessionStorage.getItem('userInfo');
        if (!storedUser) return null;

        try {
            const userInfo = JSON.parse(storedUser);

            if (userInfo.expiry) {
                const expiryTimeMs = userInfo.expiry * 1000;
                const currentTimeMs = Date.now();

                if (expiryTimeMs > currentTimeMs) {
                    // Auto-logout when token expires
                    setTimeout(() => {
                        sessionStorage.removeItem('userInfo');
                        dispatch(logout());
                        window.location.href = '/login';
                    }, expiryTimeMs - currentTimeMs);

                    return userInfo;
                }
            }

            // Token expired or invalid
            sessionStorage.removeItem('userInfo');
            return null;
        } catch (error) {
            console.error("Session restore error:", error);
            return null;
        }
    }
);

const initialState = {
    userInfo: null,
    isAuthenticated: false,
    loading: { userInfo: true }, // Set initial loading to true
    error: { userInfo: null },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = true;
            state.userInfo = action.payload;
            state.loading.userInfo = false;
            state.error.userInfo = null;
        },
        logout: (state) => {
            sessionStorage.removeItem('userInfo');
            state.userInfo = null;
            state.isAuthenticated = false;
            state.loading.userInfo = false;
            state.error.userInfo = null;
        },
        clearAuthError: (state) => {
            state.error.userInfo = null;
        }
    },
    extraReducers: (builder) => {
        handleAsyncActions(builder, loginUser, 'userInfo', (state, action) => {
            state.userInfo = action.payload;
            state.isAuthenticated = true;
            state.loading.userInfo = false;
            state.error.userInfo = null;
        });

        builder.addCase(restoreSession.pending, (state) => {
            state.loading.userInfo = true;
        });
        builder.addCase(restoreSession.fulfilled, (state, action) => {
            state.loading.userInfo = false;
            if (action.payload) {
                state.userInfo = action.payload;
                state.isAuthenticated = true;
            }
        });
        builder.addCase(restoreSession.rejected, (state, action) => {
            state.loading.userInfo = false;
            state.error.userInfo = action.error.message;
        });
    }
});

export const { setAuth, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;