import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useEchoTheme } from '../hooks/useEchoTheme';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';

export const UplineScreen = ({ navigation }: any) => {
    const theme = useEchoTheme();
    const relayNumber = '+15550000000'; // Configured Relay

    const handlePing = async () => {
        const smsUrl = `sms:${relayNumber}${Platform.OS === 'ios' ? '&' : '?'}body=ELINK_PING`;
        try {
            await Linking.openURL(smsUrl);
        } catch {
            Alert.alert("Error", "Could not open SMS app");
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={theme.background} style={StyleSheet.absoluteFill} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={[styles.backText, { color: theme.secondary }]}>← BACK</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.text }]}>UPLINE COMMAND</Text>

            <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                <Text style={[styles.label, { color: theme.secondary }]}>RELAY NODE:</Text>
                <Text style={[styles.value, { color: theme.text }]}>{relayNumber}</Text>

                <Text style={[styles.label, { color: theme.secondary, marginTop: 20 }]}>STATUS:</Text>
                <Text style={[styles.value, { color: theme.accent }]}>UNKNOWN</Text>
            </View>

            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.accent }]} onPress={handlePing}>
                <Text style={styles.btnText}>PING UPLINE (SMS)</Text>
            </TouchableOpacity>

            <Text style={[styles.hint, { color: theme.secondary }]}>
                Sends a 'PING' command to the configured relay to check connectivity and credit balance.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    backBtn: { marginTop: 40, marginBottom: 20 },
    backText: { fontWeight: '700', letterSpacing: 1 },
    title: { fontSize: 24, fontWeight: '900', marginBottom: 30, letterSpacing: 1 },
    card: { padding: 24, borderRadius: 16, borderWidth: 1, marginBottom: 30 },
    label: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
    value: { fontSize: 18, fontWeight: '800' },
    btn: { padding: 20, borderRadius: 12, alignItems: 'center' },
    btnText: { fontWeight: '900', color: '#000', letterSpacing: 1 },
    hint: { marginTop: 20, textAlign: 'center', fontSize: 13, lineHeight: 20 }
});
