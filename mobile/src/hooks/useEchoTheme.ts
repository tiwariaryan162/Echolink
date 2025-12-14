import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

// Online: "Platinum & Emerald" - Lavish, Clean, High-Tech
const onlineTheme = {
    mode: 'online',
    background: ['#ffffff', '#f8fafc', '#f1f5f9'], // Clean White/Gray
    text: '#9fb0d5ff', // Rich Black (High Contrast)
    accent: '#059669', // Emerald Gem
    secondary: '#4b5563', // Solid Gray
    cardBg: '#ffffff', // Solid Background (No Glass) for clarity
    cardBorder: '#e2e8f0',
    statusColor: '#059669',
    shadow: '#cbd5e1',
    placeholder: '#9ca3af'
};

// Offline: "Obsidian & Gold" - Luxury, Dark, Cyber-Sovereign
const offlineTheme = {
    mode: 'offline',
    background: ['#0f0c29', '#1a1b4b', '#2e2b5e'], // Deep Midnight
    text: '#ffffff', // Pure White (High Contrast)
    accent: '#FFD700', // Solid Gold
    secondary: '#e2e8f0', // Light Gray
    cardBg: '#1e293b', // Solid Dark Slate
    cardBorder: '#475569',
    statusColor: '#FFD700',
    shadow: '#000000',
    placeholder: '#94a3b8'
};

export const useEchoTheme = () => {
    const isConnected = useSelector((state: RootState) => state.network.isConnected);
    return isConnected ? onlineTheme : offlineTheme;
};
