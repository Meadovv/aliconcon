import { createSlice } from '@reduxjs/toolkit'

const loaderSlice = createSlice({
    name: 'loader',
    initialState: false, 
    reducers: {
        setLoader: (state, action) => {
            state = action.payload;
        },
    }
})

export const { setLoader } = loaderSlice.actions;
export default loaderSlice.reducer;