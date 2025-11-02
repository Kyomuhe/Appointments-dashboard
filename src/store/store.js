import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import navigationReducer from './navigationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navigation: navigationReducer,
  },
});

export default store;