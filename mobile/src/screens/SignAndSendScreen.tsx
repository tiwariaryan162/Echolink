import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Dimensions,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import { useSelector } from 'react-redux';
import { useEchoTheme } from '../hooks/useEchoTheme';
import { RootState } from '../store/store';
import { TxBuilder } from '../utils/TxBuilder';
import { CompressionUtils } from '../utils/CompressionUtils';

const { width } = Dimensions.get('window');

export const SignAndSendScreen = ({ route, navigation }: any) => {
    const { recipient, amount } = route.params;
    const theme = useEchoTheme();
    const { privateKey } = useSelector((state: RootState) => state.wallet);

    const [status, setStatus] = useState<'UNSIGNED' | 'SIGNED'>('UNSIGNED');
    const [signedPayload, setSignedPayload] = useState('');
    const [loading, setLoading] = useState(false);

    const relayUrl =
        Platform.OS === 'android'
            ? 'http://172.22.67.110:3000/sms-incoming'
            : 'http://localhost:3000/sms-incoming';

    const relayNumber = '+15550000000';

    const handleSign = async () => {
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            if (!privateKey) throw new Error('Wallet not found');

            const rawTx = await TxBuilder.constructAndSign(
                privateKey,
                recipient,
                amount,
                0
            );

            setSignedPayload(rawTx);
            setStatus('SIGNED');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e: any) {
            Alert.alert('Signing Failed', e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTransmitSMS = async () => {
        try {
            const compressed = CompressionUtils.compress(signedPayload);
            const parts = CompressionUtils.splitForSMS(compressed);

            const smsUrl = `sms:${relayNumber}${Platform.OS === 'ios' ? '&' : '?'
                }body=${encodeURIComponent(parts[0])}`;

            await Linking.openURL(smsUrl);
            navigation.replace('Success');
        } catch {
            Alert.alert('Error', 'SMS transmission failed');
        }
    };

    const handleSimulateRelay = async () => {
        try {
            const compressed = CompressionUtils.compress(signedPayload);

            await fetch(relayUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ From: '+1555VIP', Body: compressed })
            });

            navigation.replace('Success');
        } catch (e: any) {
            Alert.alert('Relay Error', e.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* 🌈 BACKGROUND */}
            <LinearGradient
                colors={theme.mode === 'dark'
                    ? ['#050505', '#0b0b2e', '#120a3d']
                    : ['#f5f7ff', '#eef1ff', '#ffffff']
                }
                style={StyleSheet.absoluteFill}
            />

            {/* ✨ GLOWING ORBS */}
            <View
                style={[
                    styles.orb,
                    styles.orbTop,
                    { backgroundColor: theme.accent }
                ]}
            />
            <View
                style={[
                    styles.orb,
                    styles.orbBottom,
                    { backgroundColor: theme.mode === 'dark' ? '#00cec9' : '#a29bfe' }
                ]}
            />

            {/* 💳 SUMMARY CARD */}
            <View
                style={[
                    styles.card,
                    { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }
                ]}
            >
                {/* BlurView Removed */}
                <View style={styles.cardContent}>
                    <Text style={[styles.label, { color: theme.secondary }]}>
                        TRANSACTION SUMMARY
                    </Text>

                    <Text style={[styles.amount, { color: theme.text }]}>
                        {amount}
                        <Text style={{ fontSize: 22, color: theme.secondary }}>
                            {' '}ETH
                        </Text>
                    </Text>

                    <Text style={[styles.toText, { color: theme.secondary }]}>
                        → {recipient.slice(0, 10)}...
                    </Text>
                </View>
            </View>

            {/* 🔐 ACTION AREA */}
            {status === 'UNSIGNED' ? (
                <TouchableOpacity
                    style={[
                        styles.signRing,
                        { borderColor: theme.accent }
                    ]}
                    onPress={handleSign}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color={theme.accent} />
                    ) : (
                        <Text style={[styles.signText, { color: theme.accent }]}>
                            TAP TO{'\n'}SIGN
                        </Text>
                    )}
                </TouchableOpacity>
            ) : (
                <View style={styles.actions}>
                    <Text style={[styles.securedText, { color: theme.accent }]}>
                        ✓ CRYPTOGRAPHICALLY SECURED
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            { backgroundColor: theme.accent }
                        ]}
                        onPress={handleTransmitSMS}
                    >
                        <Text style={styles.primaryBtnText}>
                            TRANSMIT VIA SMS
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            { backgroundColor: theme.accent }
                        ]}
                        onPress={handleSimulateRelay}>
                        <Text style={[styles.devText]}>
                            DEV: SIMULATE RELAY
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center'
    },

    orb: {
        position: 'absolute',
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width,
        opacity: 0.25
    },

    card: {
        borderRadius: 26,
        borderWidth: 1,
        marginBottom: 50,
        overflow: 'hidden'
    },

    cardContent: {
        padding: 26,
        alignItems: 'center'
    },

    label: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 12
    },

    amount: {
        fontSize: 44,
        fontWeight: '900',
    },

    toText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600'
    },

    signRing: {
        height: 200,
        width: 200,
        borderRadius: 100,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },

    signText: {
        fontWeight: '900',
        letterSpacing: 1,
        textAlign: 'center'
    },

    actions: {
        alignItems: 'center'
    },

    securedText: {
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 30
    },

    primaryBtn: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 18,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16
    },

    primaryBtnText: {
        fontWeight: '900',
        letterSpacing: 1,
        color: '#0b102a'
    },

    devText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
        backgroundColor: '#2c996cff'
    },
    orbTop: {
        top: -120,
        left: -100
    },
    orbBottom: {
        bottom: -140,
        right: -120
    }
});