import { StyleSheet } from 'react-native';
import { COLORS, FONTS, getFigmaDimension } from '../../../utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: getFigmaDimension(120),
    height: getFigmaDimension(120),
    marginBottom: getFigmaDimension(24),
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(32),
    color: COLORS.white,
    marginBottom: getFigmaDimension(8),
  },
  tagline: {
    fontFamily: FONTS.medium,
    fontSize: getFigmaDimension(16),
    color: COLORS.white,
    opacity: 0.9,
  },
});
