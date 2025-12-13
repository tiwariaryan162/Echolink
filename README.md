# EchoLink: Censorship-Resistant Offline Transaction Relay

**EchoLink** is an Open Source initiative to enable cryptocurrency transactions during internet blackouts. It allows users to sign transactions offline on their mobile device and transmit them via SMS (or Bluetooth Mesh) to a "Relay Node" in a connected region, which then broadcasts the transaction to the blockchain.

## Project Structure

*   **/mobile**: React Native Application (Offline Wallet & Signer)
*   **/relay**: Node.js Server (Receives SMS & Broadcasts to Chain)

## Key Features

1.  **Offline Wallet Generation**: Uses BIP-39 to generate keys locally without ever touching the network.
2.  **Offline Signing**: Constructs and signs raw transaction hexes on the isolated device.
3.  **Compression Protocol**: Converts raw hex data into optimized Base64 strings suitable for SMS transportation.
4.  **Relay Architecture**: A simple listening node that accepts these compressed payloads, creates a proxy broadcast, and returns confirmation.

## Getting Started

### Mobile App
```bash
cd mobile
npm install
npm start
```
*Note: Requires React Native development environment.*

### Relay Node
```bash
cd relay
npm install
node server.js
```
*Note: To test the SMS feature, use a service like Twilio or ngrok to expose your localhost port 3000.*

## Open Source Contribution

EchoLink is designed to be **Universal**. Currently, the MVP demonstrates an Ethereum-compatible implementation (using `ethers.js`) logic. 

**How to contribute support for other chains (e.g., Ergo, Bitcoin, Solana):**

1.  **Mobile Side**:
    *   Navigate to `mobile/src/utils/Transaction.js`.
    *   Implement a new function `create[Chain]Transaction`.
    *   Ensure it returns a raw signed hex/byte string.

2.  **Relay Side**:
    *   Navigate to `relay/src/utils/Blockchain.js`.
    *   Add a provider for your chain.
    *   Implement `broadcast[Chain]Transaction` that accepts the raw data and submits it to an RPC node.

3.  **Compression**:
    *   If your chain's transaction format is significantly larger than ETH, consider improved compression algorithms in `mobile/src/utils/Compression.js`.

## License
MIT
