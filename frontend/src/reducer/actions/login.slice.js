import { createSlice } from '@reduxjs/toolkit'

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        login: false
    },
    reducers: {
        switchModal: (state) => {
            state.login = !state.login;
        }
    }
})

export const { switchModal } = loginSlice.actions;
export default loginSlice.reducer;