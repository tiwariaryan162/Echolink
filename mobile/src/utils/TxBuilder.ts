import { ethers } from 'ethers';

// CONSTANTS
const DEFAULT_GAS_LIMIT = 21000;
const DEFAULT_GAS_PRICE_GWEI = "20"; // 20 Gwei (Static fallback)
const DEFAULT_NONCE = 0; // User must manually override if they have done txs

/**
 * Constructs and signs a transaction without external network calls.
 */
export class TxBuilder {

    /**
     * manualNonce and manualGasPrice are required for true offline usage
     * since we cannot query the node.
     */
    static async constructAndSign(
        privateKey: string,
        to: string,
        amountEth: string,
        manualNonce: number = DEFAULT_NONCE,
        manualGasPriceGwei: string = DEFAULT_GAS_PRICE_GWEI
    ): Promise<string> {

        try {
            // 1. Initialize Wallet (Cold)
            const wallet = new ethers.Wallet(privateKey);

            // 2. Format Values
            const value = ethers.parseEther(amountEth);
            const gasPrice = ethers.parseUnits(manualGasPriceGwei, "gwei");

            // 3. Construct Payload
            const tx = {
                to,
                value,
                nonce: manualNonce,
                gasLimit: DEFAULT_GAS_LIMIT,
                gasPrice,
                chainId: 11155111, // Sepolia ID (Hardcoded for MVP, should be dynamic)
            };

            // 4. Sign Locally
            const signedTx = await wallet.signTransaction(tx);
            return signedTx;

        } catch (error) {
            console.error("TxBuilder Error:", error);
            throw new Error("Failed to sign transaction offline.");
        }
    }

    static isValidAddress(address: string): boolean {
        return ethers.isAddress(address);
    }
}
