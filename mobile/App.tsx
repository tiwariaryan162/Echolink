import 'react-native-gesture-handler'; // Required for React Navigation
import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';

import { store } from './src/store/store';
import { updateNetworkStatus } from './src/store/networkSlice';
import { AppNavigator } from './src/navigation/AppNavigator';

const AppContent = () => {
    const dispatch = useDispatch();

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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <AppNavigator />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

export default function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}
