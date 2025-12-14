import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEchoTheme } from '../hooks/useEchoTheme';
import { LinearGradient } from 'expo-linear-gradient';

export const TermsScreen = ({ navigation }: any) => {
    const theme = useEchoTheme();

    return (
        <View style={styles.container}>
            <LinearGradient colors={theme.background} style={StyleSheet.absoluteFill} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={[styles.backText, { color: theme.secondary }]}>← BACK</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.text }]}>TERMS & CONDITIONS</Text>

            <ScrollView style={styles.content}>
                <Text style={[styles.text, { color: theme.secondary }]}>
                    1. ACCEPTANCE{'\n'}
                    By using EchoLink, you agree to be bound by these terms.{'\n\n'}
                    2. NO WARRANTY{'\n'}
                    This software is provided "as is" without warranty of any kind. Use at your own risk.{'\n\n'}
                    3. SECURITY{'\n'}
                    You are solely responsible for safeguarding your private keys and mnemonic phrases.{'\n\n'}
                    4. RELAY SERVICE{'\n'}
                    SMS Relay services are experimental. Delivery is not guaranteed.{'\n\n'}
                    5. DATA PRIVACY{'\n'}
                    EchoLink does not collect or store your personal data. Keys remain on your device.
                </Text>
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
    text: { fontSize: 16, lineHeight: 24, fontWeight: '500' }
});
