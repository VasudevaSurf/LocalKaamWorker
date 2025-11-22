import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './WelcomeCarouselScreen.styles';
import { COLORS } from '../../../utils';
import { useAuth } from '../../../context/AuthContext';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string[];
  iconGradient: string[];
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Showcase Your Skills',
    description:
      'Upload videos of your work to demonstrate your expertise and attract more customers',
    icon: 'video-vintage',
    gradient: ['#667eea', '#764ba2'],
    iconGradient: ['#667eea', '#764ba2'],
  },
  {
    id: '2',
    title: 'Get Job Inquiries',
    description:
      'Receive job requests from customers nearby who need your services',
    icon: 'briefcase-search',
    gradient: ['#f093fb', '#f5576c'],
    iconGradient: ['#f093fb', '#f5576c'],
  },
  {
    id: '3',
    title: 'Earn More Money',
    description:
      'Complete jobs, receive payments, and track your earnings easily',
    icon: 'cash-multiple',
    gradient: ['#4facfe', '#00f2fe'],
    iconGradient: ['#4facfe', '#00f2fe'],
  },
];

const WelcomeCarouselScreen = () => {
  const navigation = useNavigation();
  const { setOnboardingComplete } = useAuth(); // Add this line
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    animateContent();
  }, [currentIndex]);

  const animateContent = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Mark onboarding as complete
      await setOnboardingComplete();
      navigation.navigate('PhoneNumber' as never);
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as complete
    await setOnboardingComplete();
    navigation.navigate('PhoneNumber' as never);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({
    item,
    index,
  }: {
    item: OnboardingSlide;
    index: number;
  }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <View style={[styles.slide, { width }]}>
        <Animated.View
          style={[
            styles.slideContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon Container with Gradient */}
          <View style={styles.iconContainer}>
            {/* Glow Effect */}
            <View style={styles.iconGlowOuter} />
            <View style={styles.iconGlowInner} />

            <LinearGradient
              colors={item.iconGradient}
              style={styles.iconCircle}
            >
              <Icon name={item.icon} size={80} color={COLORS.white} />
            </LinearGradient>

            {/* Floating Particles */}
            <View style={[styles.floatingParticle, styles.particle1]} />
            <View style={[styles.floatingParticle, styles.particle2]} />
            <View style={[styles.floatingParticle, styles.particle3]} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{item.description}</Text>

          {/* Decorative Elements */}
          <View style={styles.decorativeContainer}>
            <View style={styles.decorativeLine} />
            <LinearGradient
              colors={item.gradient}
              style={styles.decorativeDot}
            />
            <View style={styles.decorativeLine} />
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            >
              <LinearGradient
                colors={SLIDES[currentIndex].gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dotGradient}
              />
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <LinearGradient colors={['#FFFFFF', '#F9FAFB']} style={styles.gradient}>
        {/* Skip Button */}
        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
            <Icon name="arrow-right" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Carousel */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={item => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={16}
        />

        {/* Dots Indicator */}
        {renderDots()}

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          {currentIndex < SLIDES.length - 1 ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={SLIDES[currentIndex].gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Icon name="arrow-right" size={24} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleNext}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#2563EB', '#1E40AF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.getStartedButtonGradient}
              >
                <Icon name="rocket-launch" size={24} color={COLORS.white} />
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default WelcomeCarouselScreen;
