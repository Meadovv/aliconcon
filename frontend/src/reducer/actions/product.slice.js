import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import { STATUS } from "../../utils/status";
import api from "../../apis";

const initialState = {
    list: [],
    current: null,
    status: {
        list: STATUS.IDLE,
        current: STATUS.IDLE
    },
    error: null
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.status.list = STATUS.LOADING;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.status.list = STATUS.SUCCEEDED;
                state.list = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.status.list = STATUS.FAILED;
                state.error = action.error.message;
            })
            .addCase(getProduct.pending, (state) => {
                state.status.current = STATUS.LOADING;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.status.current = STATUS.SUCCEEDED;
                state.current = action.payload;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.status.current = STATUS.FAILED;
                state.error = action.error.message;
            });
    },
});

export const getProducts = createAsyncThunk(
    'product/getProducts',
    async ({ shop = '', category = '', low_price = '', high_price = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(api.GET_PRODUCTS({ shop, category, low_price, high_price }));
            return response.data.metadata;
        } catch (err) {
            return rejectWithValue(err.response.message);
        }
    }
);

export const getProduct = createAsyncThunk(
    'product/getProduct',
    async ({ id, user = '' }, { rejectWithValue }) => {
        try {
            const response = await axios.get(api.GET_PRODUCT({ id, user }));
            return response.data.metadata;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export default productSlice.reducer;