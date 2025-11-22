import { StyleSheet } from 'react-native';
import { COLORS, FONTS, getFigmaDimension } from '../../../utils';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: getFigmaDimension(24),
    paddingTop: getFigmaDimension(32),
    paddingBottom: getFigmaDimension(24),
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(28),
    color: COLORS.textPrimary,
    marginBottom: getFigmaDimension(8),
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(16),
    color: COLORS.textSecondary,
    lineHeight: getFigmaDimension(24),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: getFigmaDimension(24),
    paddingBottom: getFigmaDimension(24),
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: getFigmaDimension(12),
    padding: getFigmaDimension(16),
    marginBottom: getFigmaDimension(12),
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  languageItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EFF6FF',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioOuter: {
    width: getFigmaDimension(24),
    height: getFigmaDimension(24),
    borderRadius: getFigmaDimension(12),
    borderWidth: 2,
    borderColor: COLORS.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getFigmaDimension(16),
  },
  radioInner: {
    width: getFigmaDimension(12),
    height: getFigmaDimension(12),
    borderRadius: getFigmaDimension(6),
    backgroundColor: COLORS.primary,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontFamily: FONTS.semiBold,
    fontSize: getFigmaDimension(16),
    color: COLORS.textPrimary,
    marginBottom: getFigmaDimension(2),
  },
  languageSubName: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(14),
    color: COLORS.textSecondary,
  },
  footer: {
    paddingHorizontal: getFigmaDimension(24),
    paddingVertical: getFigmaDimension(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: getFigmaDimension(12),
    paddingVertical: getFigmaDimension(16),
    paddingHorizontal: getFigmaDimension(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: getFigmaDimension(16),
    color: COLORS.white,
    marginRight: getFigmaDimension(8),
  },
});
