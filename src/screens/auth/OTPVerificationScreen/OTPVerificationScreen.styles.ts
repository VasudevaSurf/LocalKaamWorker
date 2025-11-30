import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, getFigmaDimension } from '../../../utils';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: getFigmaDimension(60),
    left: getFigmaDimension(24),
    width: getFigmaDimension(44),
    height: getFigmaDimension(44),
    borderRadius: getFigmaDimension(22),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: getFigmaDimension(24),
    paddingTop: getFigmaDimension(120),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getFigmaDimension(40),
  },
  iconContainer: {
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
    marginBottom: getFigmaDimension(12),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(16),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: getFigmaDimension(24),
  },
  phoneNumber: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  inputSection: {
    marginBottom: getFigmaDimension(24),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getFigmaDimension(32),
  },
  otpInput: {
    width: getFigmaDimension(48),
    height: getFigmaDimension(56),
    borderRadius: getFigmaDimension(12),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: getFigmaDimension(24),
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#EFF6FF',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(14),
    color: COLORS.textSecondary,
  },
  resendLink: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(14),
    color: COLORS.primary,
  },
  resendLinkDisabled: {
    color: COLORS.gray400,
  },
  spacer: {
    flex: 1,
  },
  buttonSection: {
    paddingBottom: getFigmaDimension(24),
  },
  verifyButton: {
    borderRadius: getFigmaDimension(16),
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  verifyButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getFigmaDimension(18),
  },
  verifyButtonText: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(18),
    color: COLORS.white,
    letterSpacing: 0.5,
  },
});
