import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
    ActivityIndicator, Platform
} from 'react-native';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

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
    // Default to a generic IP placeholder to encourage user to change it
    const [relayUrl, setRelayUrl] = useState(Platform.OS === 'android' ? 'http://172.22.67.110:3000/sms-incoming' : 'http://localhost:3000/sms-incoming');

    const [wallet, setWallet] = useState<any>(null);
    const [signedPayload, setSignedPayload] = useState('');
    const [status, setStatus] = useState('Ready');
    const [loading, setLoading] = useState(false);

    const ensureWallet = async () => {
        if (!wallet) {
            setLoading(true);
            const w = await generateWallet();
            setWallet(w);
            setLoading(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const handleSign = async () => {
        if (!wallet) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return Alert.alert("Authentication Required", "Please verify your Identity first.");
        }
        setLoading(true);
        setStatus('Signing...');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            const rawTx = await TxBuilder.constructAndSign(
                wallet.privateKey,
                recipient,
                amount,
                parseInt(nonce)
            );
            setSignedPayload(rawTx);
            setStatus('Signed Encrypted');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e: any) {
            console.error(e);
            setStatus('Error');
            Alert.alert("Error", e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTransmit = async () => {
        if (!signedPayload) return;
        Haptics.selectionAsync();

        try {
            const compressed = CompressionUtils.compress(signedPayload);
            const parts = CompressionUtils.splitForSMS(compressed);

            if (parts.length > 1) {
                Alert.alert("Large Payload", `Requires ${parts.length} SMS packets.`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Proceed", onPress: () => openSMS(parts[0]) }
                ]);
            } else {
                openSMS(parts[0]);
            }
        } catch (e) {
            setStatus('Compression Failed');
        }
    };

    const openSMS = async (body: string) => {
        const smsUrl = `sms:${relayNumber}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(body)}`;
        await Linking.openURL(smsUrl);
        setStatus('Sent to Carrier');
    };

    const handleSimulate = async () => {
        if (!signedPayload) {
            Alert.alert("Action Required", "Please SIGN the payload first.");
            return;
        }

        setStatus('Contacting Node...');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        console.log(`[Simulate] Sending to: ${relayUrl}`);

        try {
            const compressed = CompressionUtils.compress(signedPayload);
            const mockBody = { From: "+1555VIP", Body: compressed };

            // TIMEOUT PROTECTOR
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const response = await fetch(relayUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const text = await response.text();
            Alert.alert("✅ Node Response", text);
            setStatus('Confirmed');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        } catch (e: any) {
            console.error("Simulation Error:", e);
            setStatus('Failed');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            let errorMsg = e.message;
            if (e.name === 'AbortError') errorMsg = "Connection Timed Out (5s). Check IP.";
            if (e.message.includes('Network request failed')) errorMsg = "Network Unreachable.\n\n1. Check IP Address matches Laptop.\n2. Disable Laptop Firewall.\n3. Ensure Phone & Laptop on same WiFi.";

            Alert.alert("❌ Simulation Failed", `URL: ${relayUrl}\n\nError: ${errorMsg}`);
        }
    };

    // --- UI COMPONENTS ---

    const GlassCard = ({ children, title }: any) => (
        <View style={[styles.glassCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, shadowColor: theme.shadow }]}>
            {/* BlurView works best on iOS, fallback on Android */}
            <BlurView intensity={theme.mode === 'online' ? 20 : 10} tint={theme.mode === 'online' ? 'light' : 'dark'} style={StyleSheet.absoluteFill} />
            <View style={styles.cardContent}>
                {title && <Text style={[styles.cardTitle, { color: theme.secondary }]}>{title}</Text>}
                {children}
            </View>
        </View>
    );

    const LavishInput = ({ label, value, onChange, placeholder, keyboardType = 'default' }: any) => (
        <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.secondary }]}>{label}</Text>
            <TextInput
                style={[styles.input, { color: theme.text, borderBottomColor: theme.secondary }]}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
        </View>
    );

    return (
        <View style={styles.container}>

            {/* 1. Identity Card */}
            <GlassCard title="IDENTITY">
                {wallet ? (
                    <View style={styles.identityRow}>
                        <View style={[styles.avatar, { backgroundColor: theme.accent }]} />
                        <View>
                            <Text style={[styles.address, { color: theme.text }]}>{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</Text>
                            <Text style={[styles.statusTag, { color: theme.accent }]}>● VERIFIED SESSION</Text>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity style={[styles.goldBtn, { borderColor: theme.accent }]} onPress={ensureWallet}>
                        <Text style={[styles.goldBtnText, { color: theme.accent }]}>GENERATE SECURE KEY</Text>
                    </TouchableOpacity>
                )}
            </GlassCard>

            {/* 2. Transaction Card */}
            <GlassCard title="CONSTRUCT">
                <LavishInput label="RECIPIENT ADDRESS" value={recipient} onChange={setRecipient} placeholder="0x..." />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 15 }}>
                        <LavishInput label="AMOUNT (ETH)" value={amount} onChange={setAmount} keyboardType="numeric" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <LavishInput label="NONCE" value={nonce} onChange={setNonce} keyboardType="numeric" />
                    </View>
                </View>
            </GlassCard>

            {/* 3. Relay Settings (Compact) */}
            <View style={{ marginVertical: 10 }}>
                <Text style={[styles.miniHeader, { color: theme.secondary }]}>RELAY CONFIG</Text>
                <TextInput
                    style={[styles.miniInput, { color: theme.secondary, backgroundColor: theme.cardBg }]}
                    value={relayUrl} onChangeText={setRelayUrl}
                    autoCapitalize="none"
                />
            </View>

            {/* 4. Action Deck */}
            <View style={styles.actionDeck}>
                {!signedPayload ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.actionBtn, { backgroundColor: theme.text, shadowColor: theme.accent }]}
                        onPress={handleSign}
                    >
                        {loading ? <ActivityIndicator color={theme.background[0]} /> : (
                            <Text style={[styles.actionBtnText, { color: theme.background[0] }]}>SIGN PAYLOAD</Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View>
                        <LinearGradient
                            colors={[theme.accent, theme.statusColor]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.gradientBtn}
                        >
                            <TouchableOpacity style={styles.fullBtn} onPress={handleTransmit}>
                                <Text style={styles.gradientBtnText}>TRANSMIT (SMS)</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        <TouchableOpacity
                            style={[styles.secondaryBtn, { backgroundColor: 'transparent', borderColor: theme.secondary }]}
                            onPress={handleSimulate}
                        >
                            <Text style={[styles.secondaryBtnText, { color: theme.text }]}>DEV: HTTP SIMULATION</Text>
                        </TouchableOpacity>

                        <Text style={[styles.hashDisplay, { color: theme.secondary }]}>
                            HASH: {signedPayload.slice(0, 20)}...
                        </Text>
                        <Text onPress={() => { setSignedPayload(''); setStatus('Reset'); }} style={[styles.resetLink, { color: theme.accent }]}>RESET</Text>
                    </View>
                )}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', paddingBottom: 50 },
    glassCard: {
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    cardContent: { padding: 20 },
    cardTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 15, opacity: 0.7 },

    inputContainer: { marginBottom: 15 },
    inputLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 5 },
    input: { fontSize: 16, borderBottomWidth: 1, paddingVertical: 8, fontWeight: '500' },
    row: { flexDirection: 'row' },

    identityRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
    address: { fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
    statusTag: { fontSize: 10, fontWeight: 'bold', marginTop: 2, paddingLeft: 2 },

    goldBtn: { borderWidth: 1, padding: 14, borderRadius: 8, alignItems: 'center', borderStyle: 'solid' },
    goldBtnText: { fontWeight: '800', letterSpacing: 1, fontSize: 12 },

    miniHeader: { fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 5, marginLeft: 5 },
    miniInput: { borderRadius: 8, padding: 10, fontSize: 10, marginBottom: 10, overflow: 'hidden' },

    actionDeck: { marginTop: 10 },
    actionBtn: { padding: 18, borderRadius: 12, alignItems: 'center', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { height: 4, width: 0 } },
    actionBtnText: { fontWeight: '900', letterSpacing: 1, fontSize: 14 },

    gradientBtn: { borderRadius: 12, marginTop: 10, overflow: 'hidden' },
    fullBtn: { padding: 18, alignItems: 'center' },
    gradientBtnText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },

    secondaryBtn: { padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 12, borderWidth: 1 },
    secondaryBtnText: { fontWeight: '700', fontSize: 12 },

    hashDisplay: { textAlign: 'center', fontSize: 10, marginTop: 15, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
    resetLink: { textAlign: 'center', fontSize: 11, fontWeight: 'bold', marginTop: 8 }
});
