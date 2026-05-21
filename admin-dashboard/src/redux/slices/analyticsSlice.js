import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSummary = createAsyncThunk('analytics/fetchSummary', async () => {
  const response = await api.get('/admin/summary');
  return response.data.data;
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    summary: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => { state.loading = true; })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;
