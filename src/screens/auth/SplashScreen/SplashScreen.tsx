import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './SplashScreen.styles';
import { COLORS } from '../../../utils';

const SplashScreen = () => {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useAuth();

  // Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const particleAnimations = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    startAnimations();
    const timer = setTimeout(() => {
      navigateToNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const startAnimations = () => {
    // Logo animation with bounce
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1.2,
        tension: 20,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo rotation
    Animated.timing(logoRotate, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Text animations
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(600),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Particle animations
    particleAnimations.forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.parallel([
            Animated.timing(particle.x, {
              toValue: Math.random() * 400 - 200,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: Math.random() * 800 - 400,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(particle.opacity, {
                toValue: 0.6,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
      ).start();
    });
  };

  const navigateToNext = () => {
    // Check if user is authenticated and profile is complete
    if (isAuthenticated && user?.profileComplete) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' as never }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LanguageSelection' as never }],
      });
    }
  };

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={['#1E40AF', '#2563EB', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Animated Particles */}
        {particleAnimations.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                ],
                opacity: particle.opacity,
              },
            ]}
          />
        ))}

        {/* Main Content */}
        <View style={styles.content}>
          {/* Animated Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }, { rotate: spin }],
              },
            ]}
          >
            <View style={styles.logoCircle}>
              <Icon name="hammer-wrench" size={80} color={COLORS.white} />
            </View>
          </Animated.View>

          {/* App Name */}
          <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
            SkillProof
          </Animated.Text>

          {/* Tagline */}
          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            Connect with Skilled Workers
          </Animated.Text>

          {/* Loading Indicator */}
          <Animated.View
            style={[styles.loadingContainer, { opacity: taglineOpacity }]}
          >
            <View style={styles.loadingDot} />
            <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
            <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
          </Animated.View>
        </View>

        {/* Bottom Badge */}
        <Animated.View
          style={[styles.bottomBadge, { opacity: taglineOpacity }]}
        >
          <Icon name="shield-check" size={20} color={COLORS.white} />
          <Text style={styles.bottomBadgeText}>
            Verified & Trusted Platform
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default SplashScreen;
