import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        _id: null,
        name: null,
        email: null,
    },
    reducers: {
        setUser: (state, action) => {
            state = action.payload;
        },
        removeUser: (state) => {
            state = {
                _id: -1,
                name: null,
                email: null,
            }
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;