import 'react-native-get-random-values';
import "@ethersproject/shims";
import { ethers } from 'ethers';
import * as bip39 from 'bip39';

// NOTE: In a real React Native environment, ensure 'crypto' globals are polyfilled.

interface WalletData {
    mnemonic: string;
    address: string;
    privateKey: string;
    type: string;
}

/**
 * Generates a standard 12-word mnemonic and derives ETH/Ergo addresses.
 * @returns {Promise<WalletData>} { mnemonic, address, privateKey }
 */
export const generateWallet = async (): Promise<WalletData> => {
    try {
        // 1. Generate Mnemonic
        const mnemonic = bip39.generateMnemonic();

        // 2. Derive Ethereum Wallet (Fallback/Example)
        const wallet = ethers.Wallet.fromPhrase(mnemonic);

        // 3. (Optional) Derive Ergo Address
        // Note: Ergo derivation requires ergo-lib-wasm-js.
        // For MVP/Hackathon, we simply log that this would happen here.
        // const ergoSecret = ...

        return {
            mnemonic,
            address: wallet.address,
            privateKey: wallet.privateKey,
            type: "Ethereum (MVP Default)"
        };
    } catch (error) {
        console.error("Wallet Generation Error:", error);
        throw error;
    }
};

/**
 * Imports a wallet from a mnemonic phrase or private key.
 * @param secret Mnemonic phrase or Private Key
 * @returns {Promise<WalletData>}
 */
export const importWallet = async (secret: string): Promise<WalletData> => {
    try {
        let wallet;
        let mnemonic = '';

        // Check if it's a mnemonic (has spaces)
        if (secret.includes(' ')) {
            if (!bip39.validateMnemonic(secret)) {
                throw new Error("Invalid Mnemonic Phrase");
            }
            wallet = ethers.Wallet.fromPhrase(secret);
            mnemonic = secret;
        } else {
            // Assume Private Key
            // Add '0x' if missing
            const pKey = secret.startsWith('0x') ? secret : `0x${secret}`;
            wallet = new ethers.Wallet(pKey);
        }

        return {
            mnemonic, // Will be empty if imported via Private Key
            address: wallet.address,
            privateKey: wallet.privateKey,
            type: "Imported"
        };
    } catch (error) {
        console.error("Wallet Import Error:", error);
        throw new Error("Invalid Key or Mnemonic");
    }
};
