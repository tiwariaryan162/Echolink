import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEchoTheme } from '../hooks/useEchoTheme';
import { LinearGradient } from 'expo-linear-gradient';

export const HistoryScreen = ({ navigation }: any) => {
    const theme = useEchoTheme();
    // Mock data for now
    const history = [
        { id: 1, to: '0x7a...8f2d', amount: '0.001', status: 'Confirmed', date: '2024-12-14 10:30' },
        { id: 2, to: '0x1b...9a4c', amount: '0.050', status: 'Pending (SMS)', date: '2024-12-14 09:15' },
        { id: 3, to: '0x3e...2d1a', amount: '0.002', status: 'Failed', date: '2024-12-13 18:45' },
        { id: 4, to: '0x99...11aa', amount: '0.100', status: 'Confirmed', date: '2024-12-13 14:20' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={theme.background} style={StyleSheet.absoluteFill} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={[styles.backText, { color: theme.secondary }]}>← BACK</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.text }]}>ALL HISTORY</Text>

            <ScrollView style={styles.content}>
                {history.map((item) => (
                    <View key={item.id} style={[styles.item, { borderBottomColor: theme.cardBorder }]}>
                        <View>
                            <Text style={[styles.to, { color: theme.text }]}>To: {item.to}</Text>
                            <Text style={[styles.date, { color: theme.secondary }]}>{item.date}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.amount, { color: theme.accent }]}>-{item.amount} ETH</Text>
                            <Text style={[styles.status, { color: theme.secondary }]}>{item.status}</Text>
                        </View>
                    </View>
                ))}
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
    item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
    to: { fontWeight: '700', fontSize: 15, marginBottom: 4 },
    date: { fontSize: 12 },
    amount: { fontWeight: '800', fontSize: 16, marginBottom: 4 },
    status: { fontSize: 12, fontWeight: '600' }
});
