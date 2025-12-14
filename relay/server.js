const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS support
const { handleIncomingSMS } = require('./src/controllers/relayController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests from the app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    console.log(`[Ping] Received ping from ${req.ip}`);
    res.send('EchoLink Relay Node is Online. Listening for SMS on POST /sms-incoming');
});

// WEBHOOK
app.post('/sms-incoming', (req, res) => {
    console.log(`[POST] /sms-incoming hit from ${req.ip}`);
    handleIncomingSMS(req, res);
});

// Start Server (Listen on 0.0.0.0 to allow LAN access)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n>>> EchoLink Relay Node running on http://172.22.67.110:${PORT}`);
    console.log(`>>> Waiting for SMS Webhooks...\n`);
});
