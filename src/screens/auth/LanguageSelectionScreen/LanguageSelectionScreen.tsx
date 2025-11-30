import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './LanguageSelectionScreen.styles';
import { COLORS } from '../../../utils';

interface Language {
  id: string;
  name: string;
  nativeName: string;
  icon: string;
}

const LANGUAGES: Language[] = [
  { id: 'en', name: 'English', nativeName: 'English', icon: '🇬🇧' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिंदी', icon: '🇮🇳' },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', icon: '🇮🇳' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', icon: '🇮🇳' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', icon: '🇮🇳' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', icon: '🇮🇳' },
];

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
  };

  const handleContinue = () => {
    // Save language preference
    navigation.navigate('OnboardingCarousel' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="translate" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Choose Your Language</Text>
          <Text style={styles.subtitle}>Select your preferred language</Text>
        </View>

        {/* Language List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.languageList}
          showsVerticalScrollIndicator={false}
        >
          {LANGUAGES.map(language => (
            <TouchableOpacity
              key={language.id}
              style={[
                styles.languageCard,
                selectedLanguage === language.id && styles.languageCardSelected,
              ]}
              onPress={() => handleLanguageSelect(language.id)}
              activeOpacity={0.7}
            >
              <View style={styles.languageLeft}>
                <Text style={styles.languageIcon}>{language.icon}</Text>
                <View style={styles.languageInfo}>
                  <Text
                    style={[
                      styles.languageName,
                      selectedLanguage === language.id &&
                        styles.languageNameSelected,
                    ]}
                  >
                    {language.name}
                  </Text>
                  <Text style={styles.languageNative}>
                    {language.nativeName}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.radioButton,
                  selectedLanguage === language.id &&
                    styles.radioButtonSelected,
                ]}
              >
                {selectedLanguage === language.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Icon name="arrow-right" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelectionScreen;
