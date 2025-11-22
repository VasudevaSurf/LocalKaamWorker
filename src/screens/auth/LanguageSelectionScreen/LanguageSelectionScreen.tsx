import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthNavigationProp } from '../../../navigation/types';
import { styles } from './LanguageSelectionScreen.styles';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

const LanguageSelectionScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const handleContinue = () => {
    // TODO: Save selected language to AsyncStorage
    navigation.navigate('WelcomeCarousel');
  };

  const renderLanguageItem = (language: Language) => {
    const isSelected = selectedLanguage === language.code;

    return (
      <TouchableOpacity
        key={language.code}
        style={[styles.languageItem, isSelected && styles.languageItemSelected]}
        onPress={() => setSelectedLanguage(language.code)}
        activeOpacity={0.7}
      >
        <View style={styles.languageContent}>
          <View style={styles.radioOuter}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
          <View style={styles.languageText}>
            <Text style={styles.languageName}>{language.nativeName}</Text>
            <Text style={styles.languageSubName}>{language.name}</Text>
          </View>
        </View>
        {isSelected && <Icon name="check-circle" size={24} color="#2563EB" />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Language</Text>
          <Text style={styles.subtitle}>
            Select your preferred language to continue
          </Text>
        </View>

        {/* Language List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {LANGUAGES.map(renderLanguageItem)}
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelectionScreen;
