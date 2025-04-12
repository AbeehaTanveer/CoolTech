// features/transactions/transactionsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async () => {
        const response = await axios.get('http://localhost:1010/get');
        return response.data;
    }
);

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState: {
        data: [],
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default transactionsSlice.reducer;
