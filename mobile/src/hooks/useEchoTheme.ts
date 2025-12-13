import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useEchoTheme = () => {
    const isConnected = useSelector((state: RootState) => state.network.isConnected);

    // Online Mode: Emerald Green & White (Clean, Modern)
    const onlineTheme = {
        mode: 'online',
        background: '#FFFFFF',
        text: '#059669', // Emerald 600
        accent: '#10B981', // Emerald 500
        subtext: '#4B5563', // Gray 600
        cardBg: '#F3F4F6', // Gray 100
        statusColor: '#059669',
        borderColor: '#D1FAE5'
    };

    // Offline Mode: High Contrast Red & Black (Cyberpunk/Terminal style)
    const offlineTheme = {
        mode: 'offline',
        background: '#0a0a0a',
        text: '#FF003C', // Cyberpunk Red
        accent: '#FF003C',
        subtext: '#D1D5DB', // Gray 300
        cardBg: '#18181b', // Gray 900
        statusColor: '#FF003C',
        borderColor: '#7F1D1D'
    };

    return isConnected ? onlineTheme : offlineTheme;
};
