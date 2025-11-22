import { StyleSheet } from 'react-native';
import { COLORS, FONTS, getFigmaDimension } from '../../utils';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getFigmaDimension(20),
    paddingVertical: getFigmaDimension(16),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  noShadow: {
    shadowOpacity: 0,
    elevation: 0,
  },

  // Left Section
  leftPlaceholder: {
    width: getFigmaDimension(44),
  },
  backButton: {
    width: getFigmaDimension(44),
    height: getFigmaDimension(44),
    borderRadius: getFigmaDimension(22),
    backgroundColor: COLORS.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: getFigmaDimension(12),
  },
  profileImage: {
    width: getFigmaDimension(50),
    height: getFigmaDimension(50),
    borderRadius: getFigmaDimension(25),
    backgroundColor: COLORS.gray200,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: getFigmaDimension(12),
    height: getFigmaDimension(12),
    borderRadius: getFigmaDimension(6),
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  greetingText: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(13),
    color: COLORS.textSecondary,
  },
  profileName: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(18),
    color: COLORS.textPrimary,
    marginTop: getFigmaDimension(2),
  },

  // Center Section
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: getFigmaDimension(16),
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(18),
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(13),
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: getFigmaDimension(2),
  },

  // Right Section
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFigmaDimension(8),
  },
  iconButton: {
    position: 'relative',
    width: getFigmaDimension(44),
    height: getFigmaDimension(44),
    borderRadius: getFigmaDimension(22),
    backgroundColor: COLORS.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: getFigmaDimension(8),
    right: getFigmaDimension(8),
    minWidth: getFigmaDimension(18),
    height: getFigmaDimension(18),
    borderRadius: getFigmaDimension(9),
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getFigmaDimension(4),
  },
  notificationBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(10),
    color: COLORS.white,
  },
});
