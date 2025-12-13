import LZString from 'lz-string';
import { Buffer } from 'buffer';

const PROTOCOL_HEADER = "ELINK::";
const SMS_CHUNK_SIZE = 140; // Safe margin for 160 char limit

export class CompressionUtils {

    static compress(hexData: string): string {
        const cleanHex = hexData.startsWith('0x') ? hexData.slice(2) : hexData;
        const compressed = LZString.compressToBase64(cleanHex);
        return `${PROTOCOL_HEADER}${compressed}`;
    }

    /**
     * Splits a long payload into multiple SMS-safe chunks.
     * Format: "ELINK_PART:1/2:<chunk>"
     */
    static splitForSMS(payload: string): string[] {
        if (payload.length <= SMS_CHUNK_SIZE) {
            return [payload];
        }

        const chunks: string[] = [];
        // Remove header for splitting if we want (or keep it simple and just split the whole string)
        // Strategy: Just split the payload string itself. It's opaque data.
        // BUT we need a header that the server recognizes as Multipart.

        // New Protocol for Multipart: ELNP:<index>/<total>:<content>
        // Let's stick to the prompt: 1/2 ELINK::...
        // Actually, prompt suggested: "1/2 ELINK::..."

        const partsCount = Math.ceil(payload.length / SMS_CHUNK_SIZE);

        for (let i = 0; i < partsCount; i++) {
            const start = i * SMS_CHUNK_SIZE;
            const end = start + SMS_CHUNK_SIZE;
            const content = payload.slice(start, end);
            // Format: "ELPART:<current>/<total>:<content>"
            // Example: "ELPART:1/2:ELINK::AbCd..."
            chunks.push(`ELPART:${i + 1}/${partsCount}:${content}`);
        }

        return chunks;
    }

    static decompress(payload: string): string | null {
        if (!payload.startsWith(PROTOCOL_HEADER)) return null;
        const base64Content = payload.replace(PROTOCOL_HEADER, '');
        const cleanHex = LZString.decompressFromBase64(base64Content);
        if (!cleanHex) return null;
        return '0x' + cleanHex;
    }
}
