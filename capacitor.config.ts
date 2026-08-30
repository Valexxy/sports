import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mivaj.sports',
  appName: 'Mivaj Sports',
  webDir: 'public',
  server: {
    // ⚡ Loads your live Vercel & GitHub deployment automatically on every app open
    url: 'https://mivaj.com',
    cleartext: false,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#070c18',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#070c18',
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#070c18',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  ios: {
    backgroundColor: '#070c18',
    preferredContentMode: 'mobile',
    contentInset: 'always',
  },
};

export default config;
