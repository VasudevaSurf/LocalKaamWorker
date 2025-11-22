import { StyleSheet } from 'react-native';
import { COLORS, FONTS, getFigmaDimension } from '../../../utils';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: getFigmaDimension(24),
    paddingTop: getFigmaDimension(40),
    paddingBottom: getFigmaDimension(32),
  },
  logoContainer: {
    width: getFigmaDimension(80),
    height: getFigmaDimension(80),
    borderRadius: getFigmaDimension(40),
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getFigmaDimension(24),
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(28),
    color: COLORS.textPrimary,
    marginBottom: getFigmaDimension(8),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(15),
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  languageList: {
    paddingHorizontal: getFigmaDimension(24),
    paddingBottom: getFigmaDimension(24),
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: getFigmaDimension(16),
    padding: getFigmaDimension(18),
    marginBottom: getFigmaDimension(12),
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  languageCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EFF6FF',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageIcon: {
    fontSize: getFigmaDimension(36),
    marginRight: getFigmaDimension(16),
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontFamily: FONTS.semiBold,
    fontSize: getFigmaDimension(16),
    color: COLORS.textPrimary,
    marginBottom: getFigmaDimension(4),
  },
  languageNameSelected: {
    color: COLORS.primary,
  },
  languageNative: {
    fontFamily: FONTS.medium,
    fontSize: getFigmaDimension(14),
    color: COLORS.textSecondary,
  },
  radioButton: {
    width: getFigmaDimension(24),
    height: getFigmaDimension(24),
    borderRadius: getFigmaDimension(12),
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: getFigmaDimension(12),
    height: getFigmaDimension(12),
    borderRadius: getFigmaDimension(6),
    backgroundColor: COLORS.primary,
  },
  footer: {
    paddingHorizontal: getFigmaDimension(24),
    paddingVertical: getFigmaDimension(20),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: getFigmaDimension(12),
    paddingVertical: getFigmaDimension(16),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: getFigmaDimension(16),
    color: COLORS.white,
    marginRight: getFigmaDimension(8),
  },
});
