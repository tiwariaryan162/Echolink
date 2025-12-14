import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useDispatch } from 'react-redux';
import { generateWallet, importWallet } from '../utils/Wallet';
import { setWallet } from '../store/walletSlice';
import { useEchoTheme } from '../hooks/useEchoTheme';

interface WelcomeScreenProps {
    navigation: {
        replace: (screen: string) => void;
    };
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const theme = useEchoTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [importVisible, setImportVisible] = useState(false);
    const [importText, setImportText] = useState('');
    const [importError, setImportError] = useState('');

    const handleCreateWallet = useCallback(async () => {
        if (loading) return;
        try {
            setLoading(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            // Yield to UI thread to allow spinner to render
            await new Promise(resolve => setTimeout(resolve, 100));

            const wallet = await generateWallet();
            dispatch(setWallet(wallet));
            navigation.replace('Dashboard');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [loading, dispatch, navigation]);

    const handleImportSubmit = async () => {
        if (!importText.trim()) return;
        setImportError('');
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            const wallet = await importWallet(importText.trim());
            dispatch(setWallet(wallet));
            setImportVisible(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.replace('Dashboard');
        } catch (e: any) {
            setImportError("Invalid Key or Mnemonic. Please check and try again.");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* 🌈 MAIN GRADIENT BACKGROUND */}
            <LinearGradient
                colors={['#050505', '#0d0d2b', '#120a3d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* ✨ GLOWING ORBS */}
            <View style={[styles.orb, styles.orbTop]} />
            <View style={[styles.orb, styles.orbBottom]} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* 🔰 BRANDING */}
                <View style={styles.content}>
                    <View style={[styles.logoContainer, { borderColor: theme.accent }]}>
                        <Text style={[styles.logoText, { color: theme.text }]}>E</Text>
                    </View>

                    <Text style={[styles.title, { color: theme.text }]}>ECHOLINK</Text>
                    <Text style={[styles.subtitle, { color: theme.secondary }]}>UNBREAKABLE BRIDGE</Text>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>DePIN SMS Bridge</Text>
                        <Text style={styles.infoText}>
                            EchoLink allows you to broadcast Ethereum transactions offline using SMS Relays.
                            Stay connected to the chain even without internet.
                        </Text>

                        <Text style={[styles.infoTitle, { marginTop: 15 }]}>Guidelines</Text>
                        <View style={styles.guidelineItem}><Text style={styles.bullet}>•</Text><Text style={styles.infoText}>Generate a new ID or Import existing.</Text></View>
                        <View style={styles.guidelineItem}><Text style={styles.bullet}>•</Text><Text style={styles.infoText}>Sign transactions securely on device.</Text></View>
                        <View style={styles.guidelineItem}><Text style={styles.bullet}>•</Text><Text style={styles.infoText}>Transmit via SMS to Relay Nodes.</Text></View>
                    </View>
                </View>

                {/* 🚀 ACTION BUTTONS */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={[styles.primaryBtn, { backgroundColor: theme.accent, opacity: loading ? 0.7 : 1 }]}
                        onPress={handleCreateWallet}
                        disabled={loading}
                    >
                        {loading && !importVisible ? (
                            <ActivityIndicator color="#f6f3f3ff" />
                        ) : (
                            <Text style={styles.primaryBtnText}>CREATE SECURE WALLET</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => setImportVisible(true)}
                        disabled={loading}
                    >
                        <Text style={[styles.secondaryBtnText]}>IMPORT EXISTING KEY</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* 🔐 IMPORT MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={importVisible}
                onRequestClose={() => setImportVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalContent, { backgroundColor: '#1e1e2e', borderColor: theme.accent }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>IMPORT WALLET</Text>
                        <Text style={[styles.modalDesc, { color: theme.secondary }]}>
                            Enter your 12-word mnemonic phrase or private key (with 0x).
                        </Text>

                        <TextInput
                            style={[styles.input, { color: theme.text, borderColor: theme.secondary }]}
                            placeholder="Mnemonic or Private Key..."
                            placeholderTextColor={theme.placeholder}
                            value={importText}
                            onChangeText={setImportText}
                            multiline
                            autoCapitalize="none"
                        />

                        {!!importError && <Text style={styles.errorText}>{importError}</Text>}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setImportVisible(false)}>
                                <Text style={styles.cancelBtnText}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: theme.accent }]} onPress={handleImportSubmit}>
                                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.confirmBtnText}>IMPORT</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'space-between' },

    /* 🌟 ORBS */
    orb: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#6c5ce7',
        // filter: 'blur(40px)' // Removed for performance & validity
        opacity: 0.15, // Reduced opacity instead
    },
    orbTop: { top: -120, left: -80 },
    orbBottom: { bottom: -140, right: -100, backgroundColor: '#00cec9' },

    /* CONTENT */
    content: { alignItems: 'center', marginTop: 60 },
    logoContainer: {
        width: 70, height: 70, borderRadius: 18, borderWidth: 2,
        justifyContent: 'center', alignItems: 'center', marginBottom: 15
    },
    logoText: { fontSize: 36, fontWeight: '900', color: 'white' },
    title: { fontSize: 28, fontWeight: '900', letterSpacing: 2, color: 'white' },
    subtitle: { fontSize: 13, letterSpacing: 3, marginTop: 4, color: 'white', fontWeight: 'bold' },

    infoCard: {
        marginTop: 30, padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)',
        width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
    },
    infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    infoText: { fontSize: 13, color: '#ccc', lineHeight: 20 },
    guidelineItem: { flexDirection: 'row', marginTop: 4 },
    bullet: { color: '#059669', marginRight: 8, fontSize: 14 },

    /* ACTIONS */
    actionContainer: { width: '100%', marginTop: 30, marginBottom: 20 },
    primaryBtn: {
        paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12,
        shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { height: 4, width: 0 }, elevation: 6
    },
    primaryBtnText: { color: '#000', fontWeight: '800', letterSpacing: 1, fontSize: 13 },
    secondaryBtn: {
        padding: 15, alignItems: 'center', backgroundColor: '#059669', borderRadius: 12,
        shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { height: 4, width: 0 }, elevation: 6
    },
    secondaryBtnText: { fontWeight: '800', letterSpacing: 1, color: '#000', fontSize: 13 },

    /* MODAL */
    modalOverlay: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.8)' },
    modalContent: {
        borderRadius: 16, padding: 25, borderWidth: 1, shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10
    },
    modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8, letterSpacing: 1 },
    modalDesc: { fontSize: 13, marginBottom: 20 },
    input: {
        borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top',
        backgroundColor: 'rgba(0,0,0,0.3)', marginBottom: 15
    },
    errorText: { color: '#ef4444', fontSize: 12, marginBottom: 15, fontWeight: 'bold' },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
    cancelBtn: { padding: 12, marginRight: 10 },
    cancelBtnText: { color: '#9ca3af', fontWeight: '700' },
    confirmBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
    confirmBtnText: { color: '#000', fontWeight: '800' }
});