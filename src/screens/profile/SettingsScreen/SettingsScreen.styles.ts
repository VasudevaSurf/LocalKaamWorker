import { StyleSheet } from 'react-native';
import { COLORS, FONTS, getFigmaDimension } from '../../../utils';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getFigmaDimension(24),
    paddingVertical: getFigmaDimension(16),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: getFigmaDimension(40),
    height: getFigmaDimension(40),
    borderRadius: getFigmaDimension(20),
    backgroundColor: COLORS.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(18),
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: getFigmaDimension(16),
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: getFigmaDimension(20),
    marginBottom: getFigmaDimension(24),
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(16),
    color: COLORS.textPrimary,
    marginBottom: getFigmaDimension(12),
    marginTop: getFigmaDimension(8),
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: getFigmaDimension(16),
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getFigmaDimension(16),
    minHeight: getFigmaDimension(72),
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: getFigmaDimension(16),
  },
  settingTextContainer: {
    marginLeft: getFigmaDimension(16),
    flex: 1,
  },
  settingTitle: {
    fontFamily: FONTS.medium,
    fontSize: getFigmaDimension(15),
    color: COLORS.textPrimary,
    marginBottom: getFigmaDimension(2),
  },
  settingDescription: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(13),
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: getFigmaDimension(54),
  },
  dangerTitle: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(16),
    color: COLORS.error,
    marginBottom: getFigmaDimension(12),
    marginTop: getFigmaDimension(8),
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: getFigmaDimension(12),
    padding: getFigmaDimension(16),
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  dangerButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: getFigmaDimension(15),
    color: COLORS.error,
    marginLeft: getFigmaDimension(8),
  },
});
