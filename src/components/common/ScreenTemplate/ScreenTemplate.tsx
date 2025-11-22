import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, getFigmaDimension } from '../../../utils';

interface ScreenTemplateProps {
  screenName: string;
}

const ScreenTemplate: React.FC<ScreenTemplateProps> = ({ screenName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{screenName}</Text>
      <Text style={styles.subText}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: FONTS.bold,
    fontSize: getFigmaDimension(24),
    color: COLORS.textPrimary,
    marginBottom: getFigmaDimension(8),
  },
  subText: {
    fontFamily: FONTS.regular,
    fontSize: getFigmaDimension(16),
    color: COLORS.textSecondary,
  },
});

export default ScreenTemplate;
