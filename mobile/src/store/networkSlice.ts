import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NetworkState {
    isConnected: boolean | null;
    connectionType: string | null;
}

const initialState: NetworkState = {
    isConnected: true, // Default to true (Optimistic)
    connectionType: 'unknown',
};

const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        updateNetworkStatus: (state, action: PayloadAction<NetworkState>) => {
            state.isConnected = action.payload.isConnected;
            state.connectionType = action.payload.connectionType;
        },
    },
});

export const { updateNetworkStatus } = networkSlice.actions;
export default networkSlice.reducer;
