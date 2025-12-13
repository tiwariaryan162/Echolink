import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEchoTheme } from '../hooks/useEchoTheme';

export const Header = () => {
    const theme = useEchoTheme();

    return (
        <View style={[styles.container, { borderBottomColor: theme.borderColor }]}>
            <Text style={[styles.title, { color: theme.accent }]}>
                {theme.mode === 'online' ? 'ECHOLINK_MESH' : 'ECHO_LINK'}
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.statusColor }]}>
                <Text style={styles.badgeText}>
                    {theme.mode === 'online' ? 'MESH ONLINE' : 'BLACKOUT PROTOCOL'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        color: '#000', // Always black text on badge for contrast
        fontSize: 10,
        fontWeight: 'bold',
    },
});
