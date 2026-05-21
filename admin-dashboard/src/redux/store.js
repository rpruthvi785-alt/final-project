import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import analyticsReducer from './slices/analyticsSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analytics: analyticsReducer,
    bookings: bookingReducer,
  },
});
