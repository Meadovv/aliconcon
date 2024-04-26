import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    login: false,
}

const modalSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        openModal: (state, { payload }) => {
            state[payload.modal] = true;
        },
        closeModal: (state, { payload }) => {
            state[payload.modal] = false;
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;