import { StyleSheet } from 'react-native';
import { COLORS, FONTS, getFigmaDimension } from '../../../utils';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: getFigmaDimension(24),
    paddingTop: getFigmaDimension(16),
    paddingBottom: getFigmaDimension(24),
  },
  backButton: {
    width: getFigmaDimension(40),
    height: getFigmaDimension(40),
    borderRadius: getFigmaDimension(20),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getFigmaDimension(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: getFigmaDimension(40),
  },
  iconContainer: {
    marginBottom: getFigmaDimension(24),
  },
  iconCircle: {
    width: getFigmaDimension(120),
    height: getFigmaDimension(120),
    borderRadius: getFigmaDimension(60),
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(24),
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: getFigmaDimension(8),
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(15),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: getFigmaDimension(22),
  },
  phoneNumber: {
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  changeNumberButton: {
    marginTop: getFigmaDimension(12),
    paddingVertical: getFigmaDimension(6),
    paddingHorizontal: getFigmaDimension(12),
  },
  changeNumberText: {
    fontFamily: FONTS.semiBold,
    fontSize: getFigmaDimension(14),
    color: COLORS.primary,
  },
  otpSection: {
    marginBottom: getFigmaDimension(32),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getFigmaDimension(24),
  },
  otpInput: {
    width: getFigmaDimension(48),
    height: getFigmaDimension(56),
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: getFigmaDimension(12),
    backgroundColor: COLORS.white,
    textAlign: 'center',
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(24),
    color: COLORS.textPrimary,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#EFF6FF',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(14),
    color: COLORS.textSecondary,
  },
  resendLink: {
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  timerText: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(14),
    color: COLORS.textSecondary,
  },
  timerHighlight: {
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  verifyButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: getFigmaDimension(12),
    paddingVertical: getFigmaDimension(16),
    paddingHorizontal: getFigmaDimension(24),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: getFigmaDimension(24),
  },
  verifyButtonDisabled: {
    backgroundColor: COLORS.gray300,
    elevation: 0,
    shadowOpacity: 0,
  },
  verifyButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: getFigmaDimension(16),
    color: COLORS.white,
    marginRight: getFigmaDimension(8),
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: getFigmaDimension(8),
    padding: getFigmaDimension(12),
  },
  infoText: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(13),
    color: '#166534',
    marginLeft: getFigmaDimension(8),
    flex: 1,
  },
});
