const { ethers } = require('ethers');

// In production, use a real provider (Infura, Alchemy, or user's own node)
// For MVP, we use the default provider or a testnet
// For MVP, we switch to Localhost to match the local deployment
// const provider = ethers.getDefaultProvider('sepolia');
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

/**
 * Broadcasts a raw signed transaction to the blockchain.
 * @param {string} signedTxHex - The raw transaction hex
 * @returns {Promise<Object>} Broadcast receipt/hash
 */
const broadcastTransaction = async (signedTxHex) => {
    try {
        console.log(`Broadcasting Tx: ${signedTxHex.substring(0, 20)}...`);

        // 1. Send Transaction
        const txResponse = await provider.broadcastTransaction(signedTxHex);
        console.log("Tx Sent! Hash:", txResponse.hash);

        // 2. (Optional) Wait for confirmation
        // const receipt = await txResponse.wait();

        return {
            success: true,
            hash: txResponse.hash,
            explorer: `https://sepolia.etherscan.io/tx/${txResponse.hash}`
        };

    } catch (error) {
        console.error("Broadcast Error:", error);

        // Fallback/Mock for Hackathon Demo if RPC fails or no gas:
        return {
            success: false,
            error: error.message,
            note: "Broadcast failed (likely due to invalid nonce/gas in offline creation or empty wallet). This proves the Relay received it though."
        };
    }
};

/**
 * Ergo Broadcast Placeholder
 */
const broadcastErgoTransaction = async (signedTxHex) => {
    // Use axios to POST to Ergo Explorer API
    // await axios.post('https://api.ergoplatform.com/api/v1/transactions', { tx: ... })
    return { success: true, hash: "mock_ergo_hash" };
}

module.exports = { broadcastTransaction, broadcastErgoTransaction };
