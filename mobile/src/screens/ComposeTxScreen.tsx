import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useEchoTheme } from '../hooks/useEchoTheme';

const { width } = Dimensions.get('window');

export const ComposeTxScreen = ({ navigation }: any) => {
    const theme = useEchoTheme();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    const handleReview = () => {
        if (!recipient || !amount) {
            Alert.alert('Missing Fields', 'Please enter recipient and amount.');
            return;
        }
        Haptics.selectionAsync();
        navigation.navigate('SignAndSend', { recipient, amount });
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
            {/* ⬅ HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.backText, { color: theme.secondary }]}>
                        ← CANCEL
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 💳 GLASS FORM CARD */}
            <View
                style={[
                    styles.card,
                    { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }
                ]}
            >
                {/* BlurView Removed */}

                <View style={styles.cardContent}>
                    {/* ADDRESS */}
                    <Text style={[styles.label, { color: theme.secondary }]}>
                        SENDING TO
                    </Text>
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="0x Wallet Address"
                        placeholderTextColor={theme.secondary}
                        value={recipient}
                        onChangeText={setRecipient}
                    />
                    <TouchableOpacity onPress={() => setRecipient("0x5FbDB2315678afecb367f032d93F642f64180aa3")}>
                        <Text style={{ color: theme.accent, fontSize: 10, fontWeight: '700', marginTop: 8, letterSpacing: 1 }}>
                            ⚡ USE DEPLOYED CONTRACT
                        </Text>
                    </TouchableOpacity>

                    {/* AMOUNT */}
                    <Text
                        style={[
                            styles.label,
                            { color: theme.secondary, marginTop: 35 }
                        ]}
                    >
                        AMOUNT (ETH)
                    </Text>
                    <View style={styles.amountRow}>
                        <TextInput
                            style={[
                                styles.amountInput,
                                { color: theme.accent }
                            ]}
                            placeholder="0.00"
                            placeholderTextColor={theme.secondary}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <Text style={[styles.ethLabel, { color: theme.secondary }]}>
                            ETH
                        </Text>
                    </View>
                </View>
            </View>

            {/* 🚀 ACTION BUTTON */}
            <TouchableOpacity
                style={[
                    styles.actionBtn,
                    {
                        backgroundColor: theme.accent,
                        shadowColor: theme.accent
                    }
                ]}
                onPress={handleReview}
            >
                <Text style={styles.actionBtnText}>REVIEW TRANSACTION</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },

    header: {
        marginTop: 50,
        marginBottom: 30
    },

    backText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1
    },

    orb: {
        position: 'absolute',
        width: width * 0.85,
        height: width * 0.85,
        borderRadius: width,
        opacity: 0.28
    },
    orbTop: {
        top: -120,
        left: -100
    },
    orbBottom: {
        bottom: -140,
        right: -120
    },

    card: {
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
        marginTop: 40
    },

    cardContent: {
        padding: 25
    },

    label: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 10
    },

    input: {
        fontSize: 18,
        fontWeight: '600',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.15)'
    },

    amountRow: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },

    amountInput: {
        fontSize: 56,
        fontWeight: '900',
        flex: 1
    },

    ethLabel: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 6
    },

    actionBtn: {
        marginTop: 40,
        padding: 20,
        borderRadius: 18,
        alignItems: 'center',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { height: 6, width: 0 }
    },

    actionBtnText: {
        fontWeight: '900',
        letterSpacing: 1,
        color: '#0b102a'
    }
});