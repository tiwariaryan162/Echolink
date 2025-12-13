const { ethers } = require('ethers');

// Public Sepolia RPC (Robust enough for Hackathon MVP, but can be flaky)
// Alternatives: Alchemy or Infura keys
const PROVIDER_URL = "https://rpc.sepolia.org";
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

/**
 * Polls the network to check if a transaction has been mined.
 * @param {string} txHash 
 * @returns {Promise<boolean>} True if mined, False if timeout
 */
const pollForConfirmation = async (txHash) => {
    const MAX_ATTEMPTS = 5;
    const INTERVAL_MS = 15000; // 15 seconds

    console.log(`[Poller] Starting watch for ${txHash.substring(0, 10)}...`);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            console.log(`[Poller] Attempt ${attempt}/${MAX_ATTEMPTS}...`);
            const receipt = await provider.getTransactionReceipt(txHash);

            if (receipt && receipt.blockNumber) {
                console.log(`[Poller] Confirmed in Block ${receipt.blockNumber}!`);
                return true;
            }
        } catch (error) {
            console.error(`[Poller] Error fetching receipt: ${error.message}`);
        }

        // Wait before next attempt
        if (attempt < MAX_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));
        }
    }

    console.log(`[Poller] Specific Timeout reached for ${txHash}`);
    return false; // Timed out
};

module.exports = {
    pollForConfirmation,
    provider // Exported for use in Controller for broadcasting
};
