const LZString = require('lz-string');

const PROTOCOL_HEADER = "ELINK::";

/**
 * Decompresses the incoming SMS body.
 * Expected format: "ELINK::<Base64_Compressed_String>"
 * @param {string} rawBody 
 * @returns {string|null} JSON string of the transaction or null if invalid
 */
const decompressPayload = (rawBody) => {
    if (!rawBody || !rawBody.startsWith(PROTOCOL_HEADER)) {
        console.error("Parser: Missing or invalid protocol header.");
        return null;
    }

    // Strip Header
    const base64Content = rawBody.replace(PROTOCOL_HEADER, '');

    // Decompress
    const decompressed = LZString.decompressFromBase64(base64Content);

    if (!decompressed) {
        console.error("Parser: Decompression returned empty/null.");
        return null;
    }

    // Re-add 0x prefix if missing (ethers requires it)
    if (!decompressed.startsWith('0x')) {
        return '0x' + decompressed;
    }

    return decompressed;
};

module.exports = {
    decompressPayload,
    PROTOCOL_HEADER
};
