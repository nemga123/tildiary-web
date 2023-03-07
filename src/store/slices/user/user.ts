import axios from 'axios';
import { RootState } from '../..';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface UserType {
  id: string | null;
  username: string | null;
  email: string | null;
}

export interface UserInfo {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: UserInfo = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

interface SignUpRequest {
  email: string;
  password: string;
  username: string;
}

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user: SignUpRequest) => {
    const response = await axios.post('/api/v1/auth/signup/', user);
    return response.data;
  }
);

interface LoginRequest {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user: LoginRequest) => {
    const response = await axios.post('/api/v1/auth/login/', user);
    return response.data;
  }
);

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
      console.log(action.payload);
      state = action.payload;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log(action.payload);
      state = action.payload;
    });
  },
});

export const userActions = UserSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default UserSlice.reducer;
