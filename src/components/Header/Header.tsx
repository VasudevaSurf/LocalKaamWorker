import React from 'react';
import { View, Text, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './Header.styles';
import { COLORS } from '../../utils';

interface HeaderProps {
  // Variant types
  variant?: 'default' | 'profile' | 'simple' | 'transparent';

  // Left side
  showBack?: boolean;
  onBackPress?: () => void;
  backIcon?: string;

  // Center
  title?: string;
  subtitle?: string;

  // Profile variant
  showProfile?: boolean;
  profileImage?: string;
  profileName?: string;
  greeting?: string;
  showOnlineBadge?: boolean;
  onProfilePress?: () => void;

  // Right side
  showNotification?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;

  showSettings?: boolean;
  onSettingsPress?: () => void;

  showSearch?: boolean;
  onSearchPress?: () => void;

  showMore?: boolean;
  onMorePress?: () => void;

  // Custom right component
  rightComponent?: React.ReactNode;

  // Styling
  containerStyle?: ViewStyle;
  backgroundColor?: string;
  showBorder?: boolean;
  showShadow?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  showBack = false,
  onBackPress,
  backIcon = 'arrow-left',
  title,
  subtitle,
  showProfile = false,
  profileImage,
  profileName,
  greeting,
  showOnlineBadge = false,
  onProfilePress,
  showNotification = false,
  notificationCount = 0,
  onNotificationPress,
  showSettings = false,
  onSettingsPress,
  showSearch = false,
  onSearchPress,
  showMore = false,
  onMorePress,
  rightComponent,
  containerStyle,
  backgroundColor,
  showBorder = true,
  showShadow = true,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  // Render left side
  const renderLeft = () => {
    if (showBack) {
      return (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Icon name={backIcon} size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      );
    }

    if (showProfile && profileImage) {
      return (
        <TouchableOpacity
          style={styles.profileSection}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            {showOnlineBadge && <View style={styles.onlineBadge} />}
          </View>
          <View>
            {greeting && <Text style={styles.greetingText}>{greeting}</Text>}
            {profileName && (
              <Text style={styles.profileName}>{profileName}</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return <View style={styles.leftPlaceholder} />;
  };

  // Render center
  const renderCenter = () => {
    if (variant === 'profile' || showProfile) {
      return null; // Profile info is on left
    }

    if (title) {
      return (
        <View style={styles.centerSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      );
    }

    return null;
  };

  // Render right side
  const renderRight = () => {
    if (rightComponent) {
      return <View style={styles.rightSection}>{rightComponent}</View>;
    }

    return (
      <View style={styles.rightSection}>
        {showSearch && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Icon name="magnify" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}

        {showNotification && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Icon name="bell-outline" size={24} color={COLORS.textPrimary} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {showSettings && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <Icon name="cog-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}

        {showMore && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMorePress}
            activeOpacity={0.7}
          >
            <Icon name="dots-vertical" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const headerStyles = [
    styles.container,
    variant === 'transparent' && styles.transparent,
    !showBorder && styles.noBorder,
    !showShadow && styles.noShadow,
    backgroundColor && { backgroundColor },
    containerStyle,
  ];

  return (
    <View style={headerStyles}>
      {renderLeft()}
      {renderCenter()}
      {renderRight()}
    </View>
  );
};

export default Header;
