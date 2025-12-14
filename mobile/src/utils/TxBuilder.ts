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

            // 1.5 Validate Address to prevent ENS Resolution (Offline)
            if (!ethers.isAddress(to)) {
                throw new Error(`Invalid Address format: ${to}`);
            }

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
                chainId: 31337, // Hardhat Localhost Chain ID
                // chainId: 11155111, // Sepolia ID
            };

            // 4. Sign Locally
            // Yield to avoid blocking UI during heavy crypto math
            await new Promise(resolve => setTimeout(resolve, 0));

            const signedTx = await wallet.signTransaction(tx);
            return signedTx;

        } catch (error: any) {
            console.error("TxBuilder Error:", error);
            // Throw the actual error so the UI can show it (e.g., "invalid decimal value")
            throw new Error(`TxBuilder: ${error.message}`);
        }
    }

    static isValidAddress(address: string): boolean {
        return ethers.isAddress(address);
    }
}
