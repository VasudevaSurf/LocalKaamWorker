import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  ViewToken,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthNavigationProp } from '../../../navigation/types';
import { styles } from './WelcomeCarouselScreen.styles';
import { totalScreenWidth } from '../../../utils';

interface CarouselItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

const CAROUSEL_DATA: CarouselItem[] = [
  {
    id: '1',
    icon: 'video-outline',
    title: 'Showcase Your Skills',
    subtitle: 'with Videos',
    description:
      'Let customers see your work before hiring you with video demonstrations',
  },
  {
    id: '2',
    icon: 'bell-ring-outline',
    title: 'Get More Job',
    subtitle: 'Inquiries',
    description:
      'Customers can find and contact you easily for their work needs',
  },
  {
    id: '3',
    icon: 'cash-multiple',
    title: 'Track Your',
    subtitle: 'Earnings',
    description:
      'Keep 100% of your payments in cash and track all your earnings',
  },
];

const WelcomeCarouselScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleSkip = () => {
    navigation.navigate('PhoneNumber');
  };

  const handleNext = () => {
    if (currentIndex < CAROUSEL_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.navigate('PhoneNumber');
    }
  };

  const renderItem = ({ item }: { item: CarouselItem }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Icon name={item.icon} size={80} color="#2563EB" />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {CAROUSEL_DATA.map((_, index) => {
        const inputRange = [
          (index - 1) * totalScreenWidth,
          index * totalScreenWidth,
          (index + 1) * totalScreenWidth,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
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
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {currentIndex < CAROUSEL_DATA.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={CAROUSEL_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        {renderDots()}

        {/* Next/Get Started Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === CAROUSEL_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Icon
            name={
              currentIndex === CAROUSEL_DATA.length - 1
                ? 'check'
                : 'arrow-right'
            }
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeCarouselScreen;
