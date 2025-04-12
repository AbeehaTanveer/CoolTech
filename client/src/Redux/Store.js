// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import TransactionSlice from './TransactionsSlice';

const store = configureStore({
    reducer: {
        transactions: TransactionSlice,
    },
});

export default store;
