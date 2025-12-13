const twilio = require('twilio');

// NOTE: In production, use process.env.TWILIO_ACCOUNT_SID etc.
// For MVP/Demo, these would be populated with real credentials.
// Leaving as placeholders or assuming ENV variables are set by user.
const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID || 'AC_MOCK_SID',
    process.env.TWILIO_AUTH_TOKEN || 'MOCK_TOKEN'
);

const MOCK_MODE = !process.env.TWILIO_ACCOUNT_SID; // Auto-mock if no creds

/**
 * Sends an SMS reply to the user.
 * @param {string} to - User's phone number
 * @param {string} body - Message content
 */
const sendReply = async (to, body) => {
    console.log(`[Twilio] Preparing to reply to ${to}: "${body}"`);

    if (MOCK_MODE) {
        console.log(`[Twilio] (MOCK) Sent successfully.`);
        return;
    }

    try {
        await client.messages.create({
            body: body,
            from: process.env.TWILIO_PHONE_NUMBER || '+15550000000',
            to: to
        });
        console.log(`[Twilio] Realy sent.`);
    } catch (error) {
        console.error(`[Twilio] Failed to send: ${error.message}`);
    }
};

module.exports = {
    sendReply
};
