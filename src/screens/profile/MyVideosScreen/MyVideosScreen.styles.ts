import { StyleSheet } from 'react-native';
import { COLORS } from '../../../utils';

const ITEM_HEIGHT = 106; // Height of video card (90) + margin (16)

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  listContent: {
    padding: 16,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 90, // Fixed height for getItemLayout
  },
  thumbnailContainer: {
    width: 120,
    height: 90,
    position: 'relative',
    backgroundColor: COLORS.black,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  videoInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  videoDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
