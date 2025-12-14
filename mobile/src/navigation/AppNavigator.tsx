import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ComposeTxScreen } from '../screens/ComposeTxScreen';
import { SignAndSendScreen } from '../screens/SignAndSendScreen';
import { SuccessScreen } from '../screens/SuccessScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { TermsScreen } from '../screens/TermsScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { UplineScreen } from '../screens/UplineScreen';
import { TxStatusScreen } from '../screens/TxStatusScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                // Smooth transitions suitable for a premium app
                ...TransitionPresets.SlideFromRightIOS,
                cardStyle: { backgroundColor: 'transparent' }
            }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="ComposeTx" component={ComposeTxScreen} />
            <Stack.Screen name="SignAndSend" component={SignAndSendScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} options={{ gestureEnabled: false }} />

            {/* Menu Suite */}
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Upline" component={UplineScreen} />
            <Stack.Screen name="TxStatus" component={TxStatusScreen} />
        </Stack.Navigator>
    );
};
