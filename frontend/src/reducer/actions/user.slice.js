import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';
import { STATUS } from "../../utils/status";
import api from "../../apis";

const userSlice = createSlice({
    name: "product",
    initialState: null,
    reducers: {},
});

export default userSlice.reducer;