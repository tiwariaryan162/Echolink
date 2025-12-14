import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useEchoTheme } from '../hooks/useEchoTheme';
import { LinearGradient } from 'expo-linear-gradient';

export const TxStatusScreen = ({ navigation }: any) => {
    const theme = useEchoTheme();
    const [txHash, setTxHash] = useState('');

    const handleCheck = () => {
        if (!txHash) return;
        Alert.alert("Status", "Checking status feature not connected to mainnet yet.");
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={theme.background} style={StyleSheet.absoluteFill} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={[styles.backText, { color: theme.secondary }]}>← BACK</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.text }]}>TX STATUS</Text>

            <Text style={[styles.label, { color: theme.secondary }]}>ENTER TRANSACTION HASH</Text>
            <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}
                placeholder="0x..."
                placeholderTextColor={theme.placeholder}
                value={txHash}
                onChangeText={setTxHash}
            />

            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.accent }]} onPress={handleCheck}>
                <Text style={styles.btnText}>CHECK STATUS</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    backBtn: { marginTop: 40, marginBottom: 20 },
    backText: { fontWeight: '700', letterSpacing: 1 },
    title: { fontSize: 24, fontWeight: '900', marginBottom: 30, letterSpacing: 1 },
    label: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
    input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, marginBottom: 20 },
    btn: { padding: 20, borderRadius: 12, alignItems: 'center' },
    btnText: { fontWeight: '900', color: '#000', letterSpacing: 1 },
});
