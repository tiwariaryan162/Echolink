import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import { useEchoTheme } from '../hooks/useEchoTheme';
import { Header } from '../components/Header';
import { RootState } from '../store/store';

export const DashboardScreen = ({ navigation }: any) => {
    const theme = useEchoTheme();
    const { address } = useSelector((state: RootState) => state.wallet);

    const HistoryItem = ({ to, amount, status }: any) => (
        <View style={[styles.historyItem, { borderBottomColor: theme.cardBorder }]}>
            <View>
                <Text style={[styles.historyLabel, { color: theme.text }]}>
                    Sent to {to}
                </Text>
                <Text style={[styles.historySub, { color: theme.secondary }]}>
                    {status}
                </Text>
            </View>
            <Text style={[styles.historyAmount, { color: theme.accent }]}>
                -{amount} ETH
            </Text>
        </View>
    );

    const handleLogout = () => {
        // Here we could clear Redux state if we wanted to fully "lock" the wallet
        // dispatch(setWallet(null)); 
        navigation.replace('Welcome');
    };

    return (
        <View style={styles.container}>
            {/* 🌈 BASE GRADIENT (LIGHT / DARK) */}
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

            <View style={styles.safeArea}>
                <Header
                    onLogout={handleLogout}
                    onMenu={() => navigation.navigate('Menu')}
                />

                {/* 💳 BALANCE CARD */}
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.cardBg,
                            borderColor: theme.cardBorder
                        }
                    ]}
                >
                    {/* Removed BlurView for High Contrast / Performance */}
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardTitle, { color: theme.secondary }]}>
                            TOTAL BALANCE
                        </Text>
                        <Text style={[styles.balance, { color: theme.text }]}>
                            0.0450
                            <Text style={{ fontSize: 20, color: theme.secondary }}>
                                {' '}ETH
                            </Text>
                        </Text>
                        <Text style={[styles.address, { color: theme.accent }]}>
                            {address?.slice(0, 8)}...{address?.slice(-6)}
                        </Text>
                    </View>
                </View>

                {/* 📜 HISTORY */}
                <Text style={[styles.sectionTitle, { color: theme.secondary }]}>
                    RECENT ACTIVITY
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <HistoryItem to="0x7a...8f2d" amount="0.001" status="Confirmed" />
                    <HistoryItem to="0x1b...9a4c" amount="0.050" status="Pending (SMS)" />
                    <HistoryItem to="0x3e...2d1a" amount="0.002" status="Failed" />
                </ScrollView>

                {/* ➕ FAB */}
                <TouchableOpacity
                    style={[
                        styles.fab,
                        {
                            backgroundColor: theme.accent,
                            shadowColor: theme.accent
                        }
                    ]}
                    onPress={() => navigation.navigate('ComposeTx')}
                >
                    <Text style={styles.fabText}>+ NEW TRANSFER</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    safeArea: {
        flex: 1,
        padding: 20,
        paddingTop: 60
    },

    /* ✨ ORBS */
    orb: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.1 // Very subtle
    },
    orbTop: {
        top: -120,
        left: -100
    },
    orbBottom: {
        bottom: -140,
        right: -120
    },

    /* 💳 CARD */
    card: {
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 1,
        marginBottom: 30
    },
    cardContent: {
        padding: 26
    },
    cardTitle: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 10
    },
    balance: {
        fontSize: 42,
        fontWeight: '800',
        marginBottom: 6,
    },
    address: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.85
    },

    /* 📜 HISTORY */
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 15
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#38f69075'
    },
    historyLabel: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 4
    },
    historySub: {
        fontSize: 10
    },
    historyAmount: {
        fontWeight: '700'
    },

    /* ➕ FAB */
    fab: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        padding: 20,
        borderRadius: 18,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowOpacity: 0.4,
                shadowRadius: 12,
                shadowOffset: { height: 6, width: 0 }
            },
            android: {
                elevation: 10
            }
        })
    },
    fabText: {
        fontWeight: '900',
        color: '#111',
        letterSpacing: 1
    }
});