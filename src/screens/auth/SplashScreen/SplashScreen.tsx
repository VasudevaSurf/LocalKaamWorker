import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../../navigation/types';
import { styles } from './SplashScreen.styles';

const SplashScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  useEffect(() => {
    // Navigate to Language Selection after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('LanguageSelection');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* TODO: Add logo image */}
        <Text style={styles.appName}>SkillProof</Text>
        <Text style={styles.tagline}>Showcase Your Skills</Text>
        <Text style={styles.tagline}>Get More Jobs</Text>
      </View>
    </View>
  );
};

export default SplashScreen;
