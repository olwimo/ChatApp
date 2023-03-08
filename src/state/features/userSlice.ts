import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AuthProvider, UserState } from "../types/user";

const initialState: UserState = {
    authProvider: 'None'
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthProvider: (state, action: PayloadAction<AuthProvider>) => {
            state.authProvider = action.payload;
        }
    }
});

export const { setAuthProvider } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
