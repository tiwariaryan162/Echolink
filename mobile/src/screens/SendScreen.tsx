import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
    ActivityIndicator, Platform
} from 'react-native';
import * as Linking from 'expo-linking';

import { useEchoTheme } from '../hooks/useEchoTheme';
import { TxBuilder } from '../utils/TxBuilder';
import { CompressionUtils } from '../utils/CompressionUtils';
import { generateWallet } from '../utils/Wallet';

export const SendScreen = () => {
    const theme = useEchoTheme();

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('0.001');
    const [nonce, setNonce] = useState('0');
    const [relayNumber, setRelayNumber] = useState('+15550000000');

    const [wallet, setWallet] = useState<any>(null);
    const [signedPayload, setSignedPayload] = useState('');
    const [status, setStatus] = useState('Ready');
    const [loading, setLoading] = useState(false);

    // Helper: Create temporary wallet if none exists (Dev Mode)
    const ensureWallet = async () => {
        if (!wallet) {
            setLoading(true);
            const w = await generateWallet();
            setWallet(w);
            setLoading(false);
            Alert.alert("Dev Wallet Created", "A temporary wallet has been generated for this session.");
        }
    };

    const handleSign = async () => {
        if (!wallet) return Alert.alert("No Wallet", "Please create/import a wallet first.");
        setLoading(true);
        setStatus('Signing Offline...');

        try {
            const rawTx = await TxBuilder.constructAndSign(
                wallet.privateKey,
                recipient,
                amount,
                parseInt(nonce)
            );

            setSignedPayload(rawTx);
            setStatus('Payload Signed');
        } catch (e: any) {
            console.error(e);
            setStatus('Error Signing');
            Alert.alert("Signing Error", e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTransmit = async () => {
        if (!signedPayload) return;

        setStatus('Processing...');
        try {
            // 1. Compress
            const compressed = CompressionUtils.compress(signedPayload);

            // 2. Split (Phase 5)
            const parts = CompressionUtils.splitForSMS(compressed);

            if (parts.length > 1) {
                Alert.alert("Large Payload", `This tx requires ${parts.length} SMS messages. Send them sequentially?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Send All", onPress: () => sendSequential(parts) }
                ]);
            } else {
                openSMS(parts[0]);
            }

        } catch (e) {
            console.error(e);
            setStatus('Error');
        }
    };

    const sendSequential = async (parts: string[]) => {
        // For Demo: Open the first part.
        openSMS(parts[0]);
        setStatus(`Sent Part 1/${parts.length}`);
    };

    const openSMS = async (body: string) => {
        const smsUrl = `sms:${relayNumber}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(body)}`;
        await Linking.openURL(smsUrl);
        setStatus('Sent to SMS App');
    };

    const handleSimulate = async () => {
        if (!signedPayload) return;

        setStatus('Simulating Network...');
        try {
            // 1. Compress
            const compressed = CompressionUtils.compress(signedPayload);

            // 2. Prepare Mock Webhook Payload
            const mockBody = {
                From: "+1555DevUser", // Mock Sender
                Body: compressed
            };

            // 3. Send HTTP Request to Local Node
            // Android Emulator uses 10.0.2.2 for localhost
            // iOS Simulator and Web use localhost
            const url = Platform.OS === 'android' ? 'http://10.0.2.2:3000/sms-incoming' : 'http://localhost:3000/sms-incoming';

            console.log(`Sending to ${url}...`);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mockBody)
            });

            const text = await response.text();
            Alert.alert("Relay Response", text);
            setStatus('Simulation Sent');

        } catch (e: any) {
            console.error(e);
            Alert.alert("Simulation Error", "Is the Relay Node running? " + e.message);
            setStatus('Sim Failed');
        }
    };

    return (
        <View style={styles.container}>
            {/* Wallet Section */}
            <View style={[styles.section, { borderColor: theme.borderColor, backgroundColor: theme.cardBg }]}>
                <Text style={[styles.header, { color: theme.text }]}>SENDER IDENTITY</Text>
                {wallet ? (
                    <Text style={[styles.value, { color: theme.accent }]}>{wallet.address.slice(0, 10)}...</Text>
                ) : (
                    <TouchableOpacity onPress={ensureWallet} style={[styles.btnSmall, { borderColor: theme.accent }]}>
                        <Text style={{ color: theme.accent, fontWeight: 'bold' }}>GENERATE SESSION WALLET</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Inputs */}
            <View style={[styles.section, { borderColor: theme.borderColor, backgroundColor: theme.cardBg }]}>
                <Text style={[styles.header, { color: theme.text }]}>TRANSACTION PARAMS</Text>

                <Text style={[styles.label, { color: theme.subtext }]}>TO (Address):</Text>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.subtext }]}
                    value={recipient} onChangeText={setRecipient} placeholder="0x..." placeholderTextColor={theme.subtext}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={[styles.label, { color: theme.subtext }]}>AMOUNT (ETH):</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text, borderColor: theme.subtext }]}
                            value={amount} onChangeText={setAmount} keyboardType="numeric"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.label, { color: theme.subtext }]}>NONCE:</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text, borderColor: theme.subtext }]}
                            value={nonce} onChangeText={setNonce} keyboardType="numeric"
                        />
                    </View>
                </View>

                <Text style={[styles.label, { color: theme.subtext, marginTop: 10 }]}>RELAY NODE #:</Text>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.subtext }]}
                    value={relayNumber} onChangeText={setRelayNumber} keyboardType="phone-pad"
                />

            </View>

            {/* Actions */}
            <View style={[styles.section, { borderColor: theme.borderColor, backgroundColor: theme.cardBg, borderLeftWidth: 4, borderLeftColor: theme.accent }]}>
                <Text style={[styles.status, { color: theme.accent }]}>STATUS: {status}</Text>

                {loading && <ActivityIndicator size="small" color={theme.accent} style={{ marginVertical: 10 }} />}

                {!signedPayload ? (
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: theme.background, borderColor: theme.accent }]}
                        onPress={handleSign}
                    >
                        <Text style={[styles.btnText, { color: theme.accent }]}>SIGN (OFFLINE)</Text>
                    </TouchableOpacity>
                ) : (
                    <View>
                        <Text numberOfLines={1} style={[styles.hash, { color: theme.subtext }]}>{signedPayload.slice(0, 30)}...</Text>

                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: theme.accent, borderColor: theme.accent }]}
                            onPress={handleTransmit}
                        >
                            <Text style={[styles.btnText, { color: '#000' }]}>TRANSMIT VIA SMS</Text>
                        </TouchableOpacity>

                        {/* SIMULATION BUTTON FOR LOCALHOST TESTING */}
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: '#222', borderColor: '#444', marginTop: 15 }]}
                            onPress={handleSimulate}
                        >
                            <Text style={[styles.btnText, { color: theme.accent }]}>DEV: SIMULATE RELAY (HTTP)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { setSignedPayload(''); setStatus('Reset'); }} style={{ marginTop: 10 }}>
                            <Text style={{ color: theme.subtext, textAlign: 'center', fontSize: 10 }}>[RESET PAYLOAD]</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    section: { borderWidth: 1, padding: 15, marginBottom: 20, borderRadius: 4 },
    header: { fontSize: 12, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
    label: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
    value: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 14 },
    input: { borderWidth: 1, padding: 10, borderRadius: 4, marginBottom: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    row: { flexDirection: 'row' },
    btn: { borderWidth: 1, padding: 15, alignItems: 'center', marginTop: 10 },
    btnText: { fontWeight: 'bold', letterSpacing: 1 },
    btnSmall: { borderWidth: 1, padding: 8, alignItems: 'center', borderStyle: 'dashed' },
    status: { fontWeight: 'bold', fontSize: 12, marginBottom: 5 },
    hash: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 10, marginBottom: 10 }
});
