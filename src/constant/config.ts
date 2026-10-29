import { NativeModules, Platform } from 'react-native';

/**
 * Deployed backend (Render). Used in release builds, and in dev too when
 * USE_PROD_API is true.
 */
export const PROD_API_URL: string = '';
const USE_PROD_API: boolean = false;

/**
 * Fallback only — used if the Metro host can't be detected.
 * Find it with: `ipconfig getifaddr en0`
 */
export const DEV_LAN_IP = '10.202.18.193';
export const API_PORT = 5001;

/**
 * In dev, the app is loaded from Metro running on your Mac, so the host in the
 * bundle URL is already the right way to reach the Mac from this device:
 * 10.0.2.2 on the Android emulator, localhost on the iOS simulator, and the
 * Mac's LAN IP on a real phone. No need to edit anything when Wi‑Fi changes.
 */
function getDevHost(): string {
  const sourceCode = NativeModules.SourceCode;
  const scriptURL: string | undefined =
    sourceCode?.getConstants?.().scriptURL ?? sourceCode?.scriptURL;
  const match = scriptURL?.match(/^https?:\/\/([^/:]+)/);
  return match?.[1] ?? DEV_LAN_IP;
}

export const API_BASE_URL =
  (!__DEV__ || USE_PROD_API) && PROD_API_URL
    ? `${PROD_API_URL.replace(/\/$/, '')}/api`
    : `http://${getDevHost()}:${API_PORT}/api`;

if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log(`[API] ${Platform.OS} → ${API_BASE_URL}`);
}
