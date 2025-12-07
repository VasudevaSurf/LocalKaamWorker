import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './ReviewsScreen.styles';
import { useAuth } from '../../../context/AuthContext';
import * as api from '../../../services/api';
import { COLORS } from '../../../utils';

const ReviewsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    if (!user?.id) return;
    try {
      const data = await api.getWorkerReviews(user.id);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={24}
            color="#F59E0B"
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: any }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri:
                item.customerId?.profileImage ||
                'https://via.placeholder.com/40',
            }}
            style={styles.userImage}
          />
          <View>
            <Text style={styles.userName}>
              {item.customerId?.name || 'Customer'}
            </Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
          <Icon name="star" size={14} color="#D97706" />
        </View>
      </View>
      {item.review ? (
        <Text style={styles.reviewText}>{item.review}</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>All Reviews</Text>
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.reviewsList}
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.ratingLarge}>
              {user?.rating ? user.rating.toFixed(1) : '0.0'}
            </Text>
            {renderRatingStars(Math.round(user?.rating || 0))}
            <Text style={styles.reviewCount}>
              Based on {user?.ratingCount || 0} reviews
            </Text>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No reviews yet</Text>
            </View>
          ) : null
        }
        refreshing={loading}
        onRefresh={fetchReviews}
      />
    </SafeAreaView>
  );
};

export default ReviewsScreen;
