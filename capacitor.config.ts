import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.github.angeloyana.financetracker',
  appName: 'Finance Tracker',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
    },
  },
  android: {
    buildOptions: {
      keystorePath: process.env.KEYSTORE_PATH,
      keystorePassword: process.env.KEYSTORE_PASSWORD,
      keystoreAlias: process.env.KEYSTORE_ALIAS,
      keystoreAliasPassword: process.env.KEYSTORE_ALIAS_PASSWORD,
      releaseType: 'APK',
      signingType: 'apksigner',
    },
  },
};

export default config;
