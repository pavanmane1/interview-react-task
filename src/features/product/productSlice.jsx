import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/product/productService';
import { handleAsyncActions } from '../../utils/functions/reduxSlice';


// Async thunk to fetch products
export const getAllProducts = createAsyncThunk(
    'products/getAllProducts',
    async (_, { rejectWithValue }) => {

        try {
            const data = await productService.getAllProducts();
            return data;
        } catch (error) {
            // Return error message for reducer
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch products'
            );
        }
    }
);

export const getProductsById = createAsyncThunk(
    'products/getProductsById',
    async (_, { rejectWithValue }) => {
        try {
            const data = await productService.getProductsByPage();
            return data;
        } catch (error) {
            // Return error message for reducer
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch products'
            );
        }
    }
);


export const addProduct = createAsyncThunk(
    "products/addProduct",
    async (productData, { rejectWithValue }) => {
        try {
            return await productService.addProduct(productData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to add product"
            );
        }
    }
);

const initialState = {
    productList: [],
    loading: {
        productList: false,
    },
    error: {
        productList: null,

    }
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        resetProductState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearProductError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        handleAsyncActions(builder, getAllProducts, 'productList');

        builder
            .addCase(addProduct.pending, (state) => {
                state.loading.addProduct = true;
                state.error.addProduct = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                console.log("Payload from addProduct:", action.payload);
                state.loading.addProduct = false;

                if (Array.isArray(state.productList)) {
                    state.productList.unshift(action.payload);
                } else {
                    // Just for debugging
                    console.warn("productList is not an array:", state.productList);
                    state.productList = [action.payload];
                }
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading.addProduct = false;
                state.error.addProduct = action.payload || 'Failed to add product';
            });
    }
});

export const { clearProductError, resetProductState } = productSlice.actions;
export default productSlice.reducer;
