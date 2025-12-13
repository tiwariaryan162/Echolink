const { Buffer } = require('buffer');

/**
 * Decompresses the data received from SMS.
 * @param {string} compressedStr - The Base64 compressed transaction
 * @returns {string} The raw hex string
 */
const decompressTransaction = (compressedStr) => {
    try {
        // 1. Base64 -> Buffer
        const buffer = Buffer.from(compressedStr, 'base64');

        // 2. Buffer -> Hex
        const hex = '0x' + buffer.toString('hex');

        return hex;
    } catch (error) {
        console.error("Decompression Error:", error);
        throw new Error("Invalid Transaction Format");
    }
};

module.exports = { decompressTransaction };
