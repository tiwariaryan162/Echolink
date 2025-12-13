const { decompressPayload } = require('../utils/parser');
const { ethers } = require('ethers');
const { pollForConfirmation, provider } = require('../services/TxPoller');
const { sendReply } = require('../services/twilioClient');

// MEMORY STORES
const processedTxCache = new Set(); // Replay Protection
const multipartStore = new Map();   // Reassembly Buffer: { "From": { parts: [], total: 0, lastUpdate: Date } }

const handleIncomingSMS = async (req, res) => {
    const { Body, From } = req.body;

    console.log(`\n[SMS] From ${From}: ${Body ? Body.substring(0, 20) + '...' : 'Empty'}`);
    res.status(200).send("Received");

    let fullPayload = Body;

    // --- 0. MULTIPART HANDLER ---
    if (Body.startsWith("ELPART:")) {
        // Format: ELPART:1/2:Content...
        try {
            const [prefix, indexInfo, content] = Body.split(':', 3);
            const [currentStr, totalStr] = indexInfo.split('/');
            const current = parseInt(currentStr);
            const total = parseInt(totalStr);

            console.log(`[Relay] Multipart ${current}/${total} detected.`);

            if (!multipartStore.has(From)) {
                multipartStore.set(From, { parts: new Array(total).fill(null), count: 0 });
            }

            const session = multipartStore.get(From);
            session.parts[current - 1] = content;
            session.count++;

            console.log(`[Relay] Stored part. have ${session.count}/${total}`);

            if (session.count === total) {
                fullPayload = session.parts.join('');
                console.log(`[Relay] Reassembly Complete! Length: ${fullPayload.length}`);
                multipartStore.delete(From);
                // Proceed with fullPayload...
            } else {
                return; // Wait for more parts
            }
        } catch (e) {
            console.error("[Relay] Multipart Error:", e.message);
            return;
        }
    }

    // --- 1. Parser & Decompression ---
    const jsonPayload = decompressPayload(fullPayload);
    if (!jsonPayload) {
        // Only log error if it wasn't a partial part (which returned early)
        console.error("[Relay] Decompression failed or Invalid Protocol.");
        return;
    }

    try {
        // --- 2. Rehydration ---
        const tx = ethers.Transaction.from(jsonPayload);
        const txHash = tx.hash; // Computed hash

        // --- 3. REPLAY PROTECTION ---
        if (processedTxCache.has(txHash)) {
            console.warn(`[Relay] REPLAY ATTACK BLOCKED. Hash ${txHash} seen recently.`);
            await sendReply(From, `⚠️ EchoLink: Duplicate Tx ignored.`);
            return;
        }

        console.log("------------------------------------------------");
        console.log("VALID TRANSACTION");
        console.log(`Hash: ${txHash}`);
        console.log(`Value: ${ethers.formatEther(tx.value)} ETH`);
        console.log("------------------------------------------------");

        processedTxCache.add(txHash);
        // Clear cache after 10 mins
        setTimeout(() => processedTxCache.delete(txHash), 10 * 60 * 1000);

        // --- 4. BROADCAST ---
        console.log(`[Relay] Broadcasting...`);
        // Note: tx.hash is computed, but we broadcast the RAW payload
        const txResponse = await provider.broadcastTransaction(jsonPayload);

        // --- 5. POLL & REPLY ---
        sendReply(From, `🚀 Tx Sent! Hash: ${txResponse.hash.substring(0, 8)}...`);
        const isMined = await pollForConfirmation(txResponse.hash);

        if (isMined) {
            await sendReply(From, `✅ Confirmed! Block mined.`);
        } else {
            await sendReply(From, `❌ Timeout. Check Explorer.`);
        }

    } catch (error) {
        console.error("[Relay] Execution Error:", error.message);
        await sendReply(From, `❌ Error: ${error.message.substring(0, 20)}`);
    }
};

module.exports = {
    handleIncomingSMS
};
