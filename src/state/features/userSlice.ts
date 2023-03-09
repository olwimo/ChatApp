import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {AuthProvider, UserState} from '../types/user';

const initialState: UserState = {
  authProvider: 'None',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthProvider: (state, action: PayloadAction<AuthProvider>) => {
      state.authProvider = action.payload;
    },
    setUserId: (state, action: PayloadAction<string | undefined>) => {
      state.userId = action.payload;
    },
  },
});

export const {setAuthProvider, setUserId} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
