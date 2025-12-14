import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useEchoTheme } from '../hooks/useEchoTheme';

export const SuccessScreen = ({ navigation }: any) => {
    const theme = useEchoTheme();
    const animation = useRef<LottieView>(null);

    useEffect(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        animation.current?.play();
    }, []);

    return (
        <View style={styles.container}>
            {/* 🌌 Background Gradient */}
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
            {/* 💎 Glass Card */}
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.cardBorder
                    }
                ]}
            >
                {/* ✨ Lottie */}
                <View style={styles.animWrap}>
                    <LottieView
                        ref={animation}
                        source={require('../../assets/success.json')}
                        autoPlay
                        loop={false}
                        style={{ width: 220, height: 220 }}
                    />
                </View>

                <Text style={[styles.title]}>
                    TRANSACTION SENT
                </Text>

                <Text style={[styles.subtitle, { color: theme.secondary }]}>
                    Secure mesh relay initiated
                </Text>
            </View>

            {/* 🚀 CTA */}
            <TouchableOpacity
                style={[styles.homeBtn, { backgroundColor: theme.accent }]}
                onPress={() => navigation.popToTop()}
            >
                <Text style={styles.homeText}>
                    RETURN TO DASHBOARD
                </Text>
            </TouchableOpacity>
        </View>
    );
};

/* 🎨 STYLES */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24
    },

    orb: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 200,
        opacity: 0.25
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
        width: '100%',
        borderRadius: 24,
        paddingVertical: 40,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderWidth: 1,
        // backdropFilter removed
    },

    animWrap: {
        marginBottom: 20
    },

    title: {
        fontSize: 19,
        fontWeight: '900',
        letterSpacing: 2,
        marginTop: 10,
        color: '#279560a3'
    },

    subtitle: {
        marginTop: 8,
        fontSize: 13,
        letterSpacing: 1,
        fontWeight: '800'
    },

    homeBtn: {
        marginTop: 40,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 14
    },

    homeText: {
        color: '#000',
        fontWeight: '900',
        letterSpacing: 1
    }
});