const express = require('express');
const bodyParser = require('body-parser');
const { handleIncomingSMS } = require('./src/controllers/relayController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false })); // Twilio sends form-urlencoded
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('EchoLink Relay Node is Online. Listening for SMS on POST /sms-incoming');
});

// WEBHOOK: Twilio Payload
app.post('/sms-incoming', handleIncomingSMS);

// Start Server
app.listen(PORT, () => {
    console.log(`\n>>> EchoLink Relay Node running on http://localhost:${PORT}`);
    console.log(`>>> Waiting for SMS Webhooks...\n`);
});
