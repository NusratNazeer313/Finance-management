import { Platform } from 'react-native';

// iOS Simulator → localhost
// Android Emulator → 10.0.2.2 (host machine loopback)
// Physical device → set your machine LAN IP below
const DEV_LAN_IP = 'localhost';

const host = Platform.select({
  ios: 'localhost',
  android: '10.0.2.2',
  default: DEV_LAN_IP,
});

export const API_BASE_URL = `http://${host}:5001/api`;
