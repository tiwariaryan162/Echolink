import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEchoTheme } from '../hooks/useEchoTheme';
import { LinearGradient } from 'expo-linear-gradient';

export const HelpScreen = ({ navigation }: any) => {
    const theme = useEchoTheme();

    return (
        <View style={styles.container}>
            <LinearGradient colors={theme.background} style={StyleSheet.absoluteFill} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={[styles.backText, { color: theme.secondary }]}>← BACK</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.text }]}>HELPS</Text>

            <ScrollView style={styles.content}>
                <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>HOW TO SEND?</Text>
                    <Text style={[styles.cardText, { color: theme.secondary }]}>
                        1. Tap "+ NEW TRANSFER" on Dashboard.{'\n'}
                        2. Enter recipient address and amount.{'\n'}
                        3. Review and Sign the transaction.{'\n'}
                        4. Select "TRANSMIT VIA SMS".
                    </Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>OFFLINE MODE</Text>
                    <Text style={[styles.cardText, { color: theme.secondary }]}>
                        EchoLink works without internet. Your transaction is compressed and sent via SMS to a Relay Node, which broadcasts it to Ethereum.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    backBtn: { marginTop: 40, marginBottom: 20 },
    backText: { fontWeight: '700', letterSpacing: 1 },
    title: { fontSize: 24, fontWeight: '900', marginBottom: 20, letterSpacing: 1 },
    content: { flex: 1 },
    card: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
    cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 10, letterSpacing: 1 },
    cardText: { fontSize: 14, lineHeight: 22, fontWeight: '500' }
});
