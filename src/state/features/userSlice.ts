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
    setRoomId: (state, action: PayloadAction<string | undefined>) => {
      state.roomId = action.payload;
    },
  },
});

export const {setAuthProvider, setUserId, setRoomId} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
