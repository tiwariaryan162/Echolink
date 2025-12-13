import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;

import React, { useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import { store } from './src/store/store';
import { updateNetworkStatus } from './src/store/networkSlice';
import { useEchoTheme } from './src/hooks/useEchoTheme';
import { Header } from './src/components/Header';
import { SendScreen } from './src/screens/SendScreen';

// Wrapper to provide Redux context
const AppWrapper = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

const App = () => {
    const dispatch = useDispatch();
    const theme = useEchoTheme();

    // Network Listener
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            dispatch(updateNetworkStatus({
                isConnected: state.isConnected,
                connectionType: state.type,
            }));
        });
        return () => unsubscribe();
    }, [dispatch]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.mode === 'online' ? "dark-content" : "light-content"} backgroundColor={theme.background} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll}>

                    <Header />

                    {/* New Phase 2 UI: Send Screen */}
                    <SendScreen />

                    <View style={styles.footer}>
                        <Text style={{ color: theme.subtext, fontSize: 10 }}>ECHOLINK v0.2.0 [PHASE 2]</Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 20, paddingBottom: 50 },
    footer: { alignItems: 'center', marginTop: 30, opacity: 0.5 }
});

export default AppWrapper;
