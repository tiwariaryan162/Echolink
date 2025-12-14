import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
    address: string | null;
    privateKey: string | null;
    mnemonic: string | null;
    isUnlocked: boolean;
}

const initialState: WalletState = {
    address: null,
    privateKey: null,
    mnemonic: null,
    isUnlocked: false,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWallet: (state, action: PayloadAction<{ address: string; privateKey: string; mnemonic?: string }>) => {
            state.address = action.payload.address;
            state.privateKey = action.payload.privateKey;
            state.mnemonic = action.payload.mnemonic || null;
            state.isUnlocked = true;
        },
        clearWallet: (state) => {
            state.address = null;
            state.privateKey = null;
            state.mnemonic = null;
            state.isUnlocked = false;
        },
    },
});

export const { setWallet, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
