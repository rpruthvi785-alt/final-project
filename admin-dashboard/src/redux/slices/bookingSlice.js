import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
  const response = await api.get('/admin/bookings');
  return response.data.data;
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bookingSlice.reducer;
