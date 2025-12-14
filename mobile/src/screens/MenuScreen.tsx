import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useEchoTheme } from '../hooks/useEchoTheme';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export const MenuScreen = ({ navigation }: any) => {
    const theme = useEchoTheme();

    const menuItems = [
        { label: 'ALL TRANSACTION HISTORY', screen: 'History' },
        { label: 'UPLINE COMMAND (RELAY)', screen: 'Upline' },
        { label: 'STATUS OF TRANSACTION', screen: 'TxStatus' },
        { label: 'HELPS', screen: 'Help' },
        { label: 'TERMS AND CONDITIONS', screen: 'Terms' },
    ];

    const handlePress = (screen: string) => {
        Haptics.selectionAsync();
        navigation.navigate(screen);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.background}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={[styles.backText, { color: theme.secondary }]}>← BACK</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>MENU</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.menuItem, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
                        onPress={() => handlePress(item.screen)}
                    >
                        <Text style={[styles.menuText, { color: theme.text }]}>{item.label}</Text>
                        <Text style={[styles.arrow, { color: theme.secondary }]}>→</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 30 },
    backBtn: { marginRight: 20, padding: 10 },
    backText: { fontWeight: '700', letterSpacing: 1 },
    title: { fontSize: 24, fontWeight: '900', letterSpacing: 2 },
    scrollContent: { paddingBottom: 40 },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        marginBottom: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    menuText: { fontWeight: '800', letterSpacing: 1, fontSize: 14 },
    arrow: { fontSize: 20, fontWeight: '900' }
});
