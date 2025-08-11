import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/user/userService';
import { handleAsyncActions } from '../../utils/functions/reduxSlice';



export const getAllUsers = createAsyncThunk(
    'user/getAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.getAllUsers();
            return data;
        } catch (error) {
            // Return error message for reducer
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch products'
            );
        }
    }
);

export const getcountry = createAsyncThunk(
    'user/getcountry',
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.getCountry();
            return data.data;
        } catch (error) {
            // Return error message for reducer
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch products'
            );
        }
    }
);

export const getState = createAsyncThunk(
    'user/getState',
    async (countyId, { rejectWithValue }) => {
        try {
            const data = await userService.getState(countyId);
            return data.data;
        } catch (error) {
            // Return error message for reducer
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch products'
            );
        }
    }
);
export const addUser = createAsyncThunk(
    "user/addUser",
    async (userData, { rejectWithValue }) => {
        try {
            // console.log("User data compact:", JSON.stringify(userData));

            return await userService.addUsers(userData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to add product"
            );
        }
    }
);
export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await userService.deleteUser(userId);
            return { userId, message: response.message };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to add product"
            );
        }
    }
);

const initialState = {
    userList: [],
    countryList: [],
    stateList: [],
    userData: {
        personalDetails: {
            name: '',
            gender: '',
            phone: '',
            profileImage: null,       // Will store the File object
            profileImagePreview: ''
        },
        countryDetails: {
            country: null,
            state: null
        },
        skillsDetails: {
            skills: []
        },
        credentialDetails: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    },
    validationErrors: {
        personalDetails: {},
        countryDetails: {},
        skillsDetails: {},
        credentialDetails: {}
    },
    loading: {
        userList: false,
        countryList: false,
        stateList: false,
        currentUser: false
    },
    error: {
        userList: null,
        countryList: null,
        stateList: null,
        currentUser: null
    }
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addSkill: (state, action) => {
            state.userData.skillsDetails.skills.push(action.payload);
        },
        removeSkill: (state, action) => {
            state.userData.skillsDetails.skills.splice(action.payload, 1);
        },
        updatePersonalDetails: (state, action) => {
            state.userData.personalDetails = { ...state.userData.personalDetails, ...action.payload };
        },
        updateCountryDetails: (state, action) => {
            state.userData.countryDetails = { ...state.userData.countryDetails, ...action.payload };
        },
        updateSkillsDetails: (state, action) => {
            state.userData.skillsDetails = { ...state.userData.skillsDetails, ...action.payload };
        },
        updateCredentialDetails: (state, action) => {
            state.userData.credentialDetails = { ...state.userData.credentialDetails, ...action.payload };
        },
        setValidationErrors: (state, action) => {
            state.validationErrors = action.payload;
        },
        clearValidationErrors: (state) => {
            state.validationErrors = {};
        },
        resetForm: (state) => {
            state.userData = initialState.userData;
            state.validationErrors = {};
        }
    },

    extraReducers: (builder) => {
        handleAsyncActions(builder, getAllUsers, 'userList');
        handleAsyncActions(builder, getcountry, 'countryList');
        handleAsyncActions(builder, getState, 'stateList');
        handleAsyncActions(builder, deleteUser, 'userList', (state, action) => {
            state.loading.userList = false;
            state.userList.data = state.userList.data.filter(
                user => user.id !== action.payload.userId
            );
        });

    }
});


export const { updatePersonalDetails,
    updateCountryDetails,
    updateSkillsDetails,
    updateCredentialDetails,
    setValidationErrors,
    clearValidationErrors,
    resetForm, addSkill, removeSkill } = userSlice.actions;
export default userSlice.reducer;
