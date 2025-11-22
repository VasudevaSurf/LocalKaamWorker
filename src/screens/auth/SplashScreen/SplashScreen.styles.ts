import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, getFigmaDimension } from '../../../utils';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: getFigmaDimension(40),
  },
  logoCircle: {
    width: getFigmaDimension(160),
    height: getFigmaDimension(160),
    borderRadius: getFigmaDimension(80),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(48),
    color: COLORS.white,
    marginBottom: getFigmaDimension(12),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: FONTS.medium,
    fontSize: getFigmaDimension(16),
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: getFigmaDimension(40),
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFigmaDimension(8),
  },
  loadingDot: {
    width: getFigmaDimension(10),
    height: getFigmaDimension(10),
    borderRadius: getFigmaDimension(5),
    backgroundColor: COLORS.white,
    opacity: 0.7,
  },
  loadingDotDelay1: {
    opacity: 0.5,
  },
  loadingDotDelay2: {
    opacity: 0.3,
  },
  bottomBadge: {
    position: 'absolute',
    bottom: getFigmaDimension(60),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: getFigmaDimension(20),
    paddingVertical: getFigmaDimension(12),
    borderRadius: getFigmaDimension(25),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomBadgeText: {
    fontFamily: FONTS.semiBold,
    fontSize: getFigmaDimension(13),
    color: COLORS.white,
    marginLeft: getFigmaDimension(8),
  },
});
