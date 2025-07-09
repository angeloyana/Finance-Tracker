import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.angeloyana.financetracker',
  appName: 'Finance Tracker',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
    },
  },
};

export default config;
