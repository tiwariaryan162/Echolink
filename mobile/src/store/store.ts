import { configureStore } from '@reduxjs/toolkit';
import networkReducer from './networkSlice';
import walletReducer from './walletSlice';

export const store = configureStore({
    reducer: {
        network: networkReducer,
        wallet: walletReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
