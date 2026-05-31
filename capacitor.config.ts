import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.madan.sumisensei',
  appName: 'Sumi Sensei',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  ios: {
    // Allow landscape + portrait on iPad
    preferredContentMode: 'mobile',
    backgroundColor: '#ffffff',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Default',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
