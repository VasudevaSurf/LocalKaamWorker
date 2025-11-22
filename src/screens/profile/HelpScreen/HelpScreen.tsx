import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './HelpScreen.styles';
import { COLORS } from '../../../utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How do I add a skill video?',
    answer:
      'Go to Dashboard, tap "Add Video" button. You can either record a new video or upload from your gallery. Videos should be 10-30 seconds long showing your work skills.',
    category: 'Videos',
  },
  {
    id: '2',
    question: 'How does payment work?',
    answer:
      'You receive cash payment directly from customers. After completing a job, request an OTP from the customer to confirm payment. Once verified, the amount is added to your earnings dashboard.',
    category: 'Payments',
  },
  {
    id: '3',
    question: 'How do I respond to job inquiries?',
    answer:
      'Go to Jobs tab, view new inquiries, and tap "Send Response". Include your quote, availability, and a message. Customers will contact you if interested.',
    category: 'Jobs',
  },
  {
    id: '4',
    question: 'Why do I need to verify payment with OTP?',
    answer:
      'OTP verification ensures both you and the customer confirm the payment. It creates a secure record and protects against disputes.',
    category: 'Payments',
  },
  {
    id: '5',
    question: 'How can I increase my profile visibility?',
    answer:
      'Keep your profile complete, add multiple skill videos, maintain high ratings, respond quickly to inquiries, and complete jobs professionally.',
    category: 'Profile',
  },
  {
    id: '6',
    question: "What if a customer doesn't pay?",
    answer:
      "Do not mark the job as complete until you receive payment. If there's a dispute, contact our support team immediately with job details.",
    category: 'Payments',
  },
];

const HelpScreen = () => {
  const navigation = useNavigation();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCall = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      'whatsapp://send?phone=919876543210&text=Hi, I need help with SkillProof Worker app',
    );
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@skillproof.com?subject=Help Request');
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const renderFAQ = (faq: FAQ) => {
    const isExpanded = expandedFAQ === faq.id;

    return (
      <TouchableOpacity
        key={faq.id}
        style={styles.faqCard}
        onPress={() => toggleFAQ(faq.id)}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <View style={styles.faqLeft}>
            <View style={styles.faqIconContainer}>
              <Icon name="help-circle" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
          </View>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={COLORS.textSecondary}
          />
        </View>

        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{faq.answer}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Contact Support Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Support</Text>

            <View style={styles.contactCardsContainer}>
              <TouchableOpacity
                style={styles.contactCard}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.contactIcon, { backgroundColor: '#DBEAFE' }]}
                >
                  <Icon name="phone" size={28} color={COLORS.primary} />
                </View>
                <Text style={styles.contactLabel}>Call Us</Text>
                <Text style={styles.contactValue}>+91-98765-43210</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactCard}
                onPress={handleWhatsApp}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.contactIcon, { backgroundColor: '#D1FAE5' }]}
                >
                  <Icon name="whatsapp" size={28} color="#25D366" />
                </View>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>Chat Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactCard}
                onPress={handleEmail}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.contactIcon, { backgroundColor: '#FEF3C7' }]}
                >
                  <Icon name="email" size={28} color="#D97706" />
                </View>
                <Text style={styles.contactLabel}>Email Us</Text>
                <Text style={styles.contactValue}>support@skillproof.com</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.quickActionsCard}>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() =>
                  Alert.alert('Video Tutorials', 'Watch helpful video guides')
                }
                activeOpacity={0.7}
              >
                <View style={styles.quickActionLeft}>
                  <Icon name="play-circle" size={22} color={COLORS.primary} />
                  <Text style={styles.quickActionText}>Video Tutorials</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() =>
                  Alert.alert('User Guide', 'Read complete user manual')
                }
                activeOpacity={0.7}
              >
                <View style={styles.quickActionLeft}>
                  <Icon name="book-open" size={22} color={COLORS.success} />
                  <Text style={styles.quickActionText}>User Guide</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() =>
                  Alert.alert('Report Issue', 'Describe your problem')
                }
                activeOpacity={0.7}
              >
                <View style={styles.quickActionLeft}>
                  <Icon name="bug" size={22} color={COLORS.error} />
                  <Text style={styles.quickActionText}>Report a Problem</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => Alert.alert('Feedback', 'Share your thoughts')}
                activeOpacity={0.7}
              >
                <View style={styles.quickActionLeft}>
                  <Icon name="message-text" size={22} color={COLORS.info} />
                  <Text style={styles.quickActionText}>Send Feedback</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* FAQs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

            {FAQS.map(renderFAQ)}
          </View>

          {/* Tips Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips for Success</Text>

            <View style={styles.tipsCard}>
              <View style={styles.tipItem}>
                <View style={styles.tipIconContainer}>
                  <Icon name="check-circle" size={20} color={COLORS.success} />
                </View>
                <Text style={styles.tipText}>
                  Add multiple skill videos to showcase your expertise
                </Text>
              </View>

              <View style={styles.tipItem}>
                <View style={styles.tipIconContainer}>
                  <Icon name="check-circle" size={20} color={COLORS.success} />
                </View>
                <Text style={styles.tipText}>
                  Respond to job inquiries within 30 minutes
                </Text>
              </View>

              <View style={styles.tipItem}>
                <View style={styles.tipIconContainer}>
                  <Icon name="check-circle" size={20} color={COLORS.success} />
                </View>
                <Text style={styles.tipText}>
                  Maintain high ratings by delivering quality work
                </Text>
              </View>

              <View style={styles.tipItem}>
                <View style={styles.tipIconContainer}>
                  <Icon name="check-circle" size={20} color={COLORS.success} />
                </View>
                <Text style={styles.tipText}>
                  Keep your profile updated with recent work
                </Text>
              </View>

              <View style={styles.tipItem}>
                <View style={styles.tipIconContainer}>
                  <Icon name="check-circle" size={20} color={COLORS.success} />
                </View>
                <Text style={styles.tipText}>
                  Communicate professionally with customers
                </Text>
              </View>
            </View>
          </View>

          {/* Support Hours */}
          <View style={styles.section}>
            <View style={styles.supportHoursCard}>
              <Icon name="clock-outline" size={24} color={COLORS.primary} />
              <View style={styles.supportHoursText}>
                <Text style={styles.supportHoursTitle}>Support Hours</Text>
                <Text style={styles.supportHoursDescription}>
                  Monday - Saturday: 9:00 AM - 9:00 PM{'\n'}
                  Sunday: 10:00 AM - 6:00 PM
                </Text>
              </View>
            </View>
          </View>

          {/* Still Need Help */}
          <View style={styles.section}>
            <View style={styles.needHelpCard}>
              <Icon name="lifebuoy" size={48} color={COLORS.primary} />
              <Text style={styles.needHelpTitle}>Still Need Help?</Text>
              <Text style={styles.needHelpText}>
                Our support team is here to help you with any questions or
                issues.
              </Text>
              <TouchableOpacity
                style={styles.contactSupportButton}
                onPress={handleWhatsApp}
                activeOpacity={0.8}
              >
                <Icon name="whatsapp" size={20} color={COLORS.white} />
                <Text style={styles.contactSupportText}>Chat with Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HelpScreen;
