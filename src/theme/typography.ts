import { Platform, TextStyle } from 'react-native';
import { colors } from './colors';

const sans = Platform.select({
  ios: 'Avenir Next',
  android: 'sans-serif',
  default: 'System',
});

const sansMedium = Platform.select({
  ios: 'Avenir Next',
  android: 'sans-serif-medium',
  default: 'System',
});

export const fontFamily = {
  regular: sans,
  medium: sansMedium,
  display: sans,
};

export const typography = {
  display: {
    fontFamily: fontFamily.display,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: colors.text,
  } as TextStyle,
  title: {
    fontFamily: fontFamily.display,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.text,
  } as TextStyle,
  heading: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.text,
  } as TextStyle,
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text,
  } as TextStyle,
  bodyStrong: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  } as TextStyle,
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  } as TextStyle,
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  } as TextStyle,
  money: {
    fontFamily: fontFamily.medium,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
    color: colors.text,
  } as TextStyle,
  moneySm: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  } as TextStyle,
};
