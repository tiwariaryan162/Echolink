import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEchoTheme } from '../hooks/useEchoTheme';
import * as Haptics from 'expo-haptics';

export const Header = ({ onLogout, onMenu }: { onLogout?: () => void, onMenu?: () => void }) => {
    const theme = useEchoTheme();

    return (
        <View style={styles.outerContainer}>
            {/* Decorative Background Glow */}
            <LinearGradient
                colors={theme.mode === 'offline' ? ['rgba(212,175,55,0.1)', 'transparent'] : ['rgba(5,150,105,0.1)', 'transparent']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.container}>
                <TouchableOpacity onPress={onMenu} style={styles.menuBtn}>
                    <Text style={[styles.menuText, { color: theme.secondary }]}>☰</Text>
                </TouchableOpacity>

                <View>
                    <Text style={[styles.title]}>
                        {theme.mode === 'online' ? 'ECHOLINK' : 'ECHO // LINK'}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.secondary }]}>
                        {theme.mode === 'online' ? 'SECURE MESH ACTIVE' : 'SOVEREIGN MODE'}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        if (onLogout) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            onLogout();
                        }
                    }}
                    style={[styles.badgeContainer, { borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}
                >
                    <View style={[styles.dot, { backgroundColor: theme.statusColor }]} />
                    <Text style={[styles.badgeText, { color: theme.accent }]}>
                        {onLogout ? 'EXIT' : (theme.mode === 'online' ? 'ONLINE' : 'OFFLINE')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    menuBtn: {
        padding: 10,
        marginRight: 10,
    },
    menuText: {
        fontSize: 24,
        fontWeight: '900',
    },
    outerContainer: {
        marginBottom: 25,
        borderRadius: 16,
        overflow: 'hidden',
    },
    container: {
        paddingVertical: 20,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 0.5,
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
        color: '#3a3838ff'
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginTop: 2,
        opacity: 0.8,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
});
