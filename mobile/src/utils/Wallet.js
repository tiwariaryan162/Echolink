import 'react-native-get-random-values';
import "@ethersproject/shims";
import { ethers } from 'ethers';
import * as bip39 from 'bip39';

// NOTE: In a real React Native environment, ensure 'crypto' globals are polyfilled.

/**
 * Generates a standard 12-word mnemonic and derives ETH/Ergo addresses.
 * @returns {Promise<Object>} { mnemonic, address, privateKey }
 */
export const generateWallet = async () => {
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
