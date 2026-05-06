// ============================================================================
// STAGE 5: REACT NATIVE MOBILE APP
// Government Scheme Eligibility & Enrollment System
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';
const SCREEN_WIDTH = Dimensions.get('window').width;

// ============================================================================
// SCREEN 1: REGISTRATION SCREEN
// ============================================================================

export const RegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    annual_income: '',
    occupation_id: 1,
    location_id: 1,
    phone_number: '',
    email: '',
    aadhaar_number: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/beneficiary/register`,
        formData
      );

      if (response.data.success) {
        Alert.alert('Success', 'Beneficiary registered successfully!');
        navigation.navigate('Dashboard', { beneficiaryId: response.data.beneficiaryId });
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Register as Beneficiary</Text>
        <Text style={styles.headerSubtitle}>
          Create your profile to access government schemes
        </Text>
      </View>

      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={formData.first_name}
          onChangeText={(text) =>
            setFormData({ ...formData, first_name: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={formData.last_name}
          onChangeText={(text) =>
            setFormData({ ...formData, last_name: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Aadhaar Number"
          value={formData.aadhaar_number}
          onChangeText={(text) =>
            setFormData({ ...formData, aadhaar_number: text })
          }
          maxLength={12}
        />
        <TextInput
          style={styles.input}
          placeholder="Annual Income"
          value={formData.annual_income}
          onChangeText={(text) =>
            setFormData({ ...formData, annual_income: text })
          }
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phone_number}
          onChangeText={(text) =>
            setFormData({ ...formData, phone_number: text })
          }
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) =>
            setFormData({ ...formData, email: text })
          }
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// ============================================================================
// SCREEN 2: DASHBOARD SCREEN
// ============================================================================

export const DashboardScreen = ({ route, navigation }) => {
  const { beneficiaryId } = route.params;
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [beneficiary, setBeneficiary] = useState(null);

  useEffect(() => {
    fetchEligibleSchemes();
  }, []);

  const fetchEligibleSchemes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/eligibility/schemes`,
        {
          headers: { 'X-Beneficiary-ID': beneficiaryId },
        }
      );

      if (response.data.success) {
        setSchemes(response.data.schemes);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading your schemes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>Your Dashboard</Text>
        <Text style={styles.eligibleCount}>
          ✓ {schemes.length} Eligible Schemes Found
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('VoiceQuery', { beneficiaryId })}
        >
          <Text style={styles.actionIcon}>🎤</Text>
          <Text style={styles.actionTitle}>Voice Query</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('StatusTracker', { beneficiaryId })}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionTitle}>My Applications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('GapAnalysis', { beneficiaryId })}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionTitle}>Opportunity Gap</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Eligible Schemes</Text>

      <FlatList
        data={schemes}
        keyExtractor={(item) => item.schemeId.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.schemeCard}
            onPress={() =>
              navigation.navigate('SchemeDetail', {
                scheme: item,
                beneficiaryId,
              })
            }
          >
            <View>
              <Text style={styles.schemeName}>{item.schemeName}</Text>
              <Text style={styles.schemeCode}>Code: {item.schemeCode}</Text>
              <Text style={styles.schemeDomain}>{item.domainName}</Text>
            </View>
            <View style={styles.benefitAmount}>
              <Text style={styles.benefitLabel}>₹</Text>
              <Text style={styles.benefitValue}>
                {(item.benefits[0]?.amount || 0).toLocaleString('en-IN')}
              </Text>
              <Text style={styles.benefitFreq}>/year</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

// ============================================================================
// SCREEN 3: VOICE QUERY SCREEN (Core Innovation)
// ============================================================================

export const VoiceQueryScreen = ({ route, navigation }) => {
  const { beneficiaryId } = route.params;
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('pa-IN');

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Read file and convert to base64
      const base64Audio = await RNFS.readFile(uri, 'base64');

      // Send to backend
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/voice/query`,
        {
          audio_base64: base64Audio,
          language_code: language,
        },
        {
          headers: { 'X-Beneficiary-ID': beneficiaryId },
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
        // Play response audio
        playResponseAudio(response.data.data.audioBase64);
      }
    } catch (error) {
      Alert.alert('Error', 'Voice query failed: ' + error.message);
    } finally {
      setLoading(false);
      setRecording(null);
    }
  };

  const playResponseAudio = async (audioBase64) => {
    try {
      const sound = new Audio.Sound();
      await sound.loadAsync({
        uri: `data:audio/mp3;base64,${audioBase64}`,
      });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎤 Voice Query</Text>
        <Text style={styles.headerSubtitle}>
          Ask about schemes in your language
        </Text>
      </View>

      <View style={styles.languageSelector}>
        <Text style={styles.label}>Language:</Text>
        <View style={styles.languageOptions}>
          {[
            { code: 'pa-IN', name: 'ਪੰਜਾਬੀ' },
            { code: 'hi-IN', name: 'हिन्दी' },
            { code: 'en-IN', name: 'English' },
          ].map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                language === lang.code && styles.languageButtonActive,
              ]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === lang.code && styles.languageButtonTextActive,
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.recordingContainer}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive,
          ]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={loading}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? '⏹ Stop Recording' : '🎙 Start Recording'}
          </Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Processing your query...</Text>
          </View>
        )}
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Results:</Text>
          <Text style={styles.resultTranscription}>
            "{result.transcription}"
          </Text>

          <Text style={styles.resultSubtitle}>
            Found {result.schemesFound} schemes:
          </Text>

          {result.schemes.map((scheme, idx) => (
            <View key={idx} style={styles.resultSchemeCard}>
              <Text style={styles.resultSchemeName}>{scheme.scheme_name}</Text>
              <Text style={styles.resultSchemeAmount}>
                ₹{scheme.max_annual_benefit?.toLocaleString('en-IN')}/year
              </Text>
            </View>
          ))}

          <Text style={styles.resultResponse}>{result.responseText}</Text>
        </View>
      )}
    </ScrollView>
  );
};

// ============================================================================
// SCREEN 4: SCHEME DETAIL SCREEN
// ============================================================================

export const SchemeDetailScreen = ({ route, navigation }) => {
  const { scheme, beneficiaryId } = route.params;
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const response = await axios.post(
        `${API_URL}/enrollment/apply`,
        { scheme_id: scheme.schemeId },
        {
          headers: { 'X-Beneficiary-ID': beneficiaryId },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Enrollment application submitted!');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.schemeDetailHeader}>
        <Text style={styles.schemeDetailTitle}>{scheme.schemeName}</Text>
        <Text style={styles.schemeDetailCode}>{scheme.schemeCode}</Text>
        <View style={styles.schemeDetailBadge}>
          <Text style={styles.badgeText}>{scheme.domainName}</Text>
        </View>
      </View>

      <View style={styles.schemeDetailCard}>
        <Text style={styles.cardTitle}>Benefits</Text>
        {scheme.benefits.map((benefit, idx) => (
          <View key={idx} style={styles.benefitRow}>
            <Text style={styles.benefitName}>{benefit.benefitName}</Text>
            <Text style={styles.benefitInfo}>
              ₹{benefit.amount?.toLocaleString('en-IN')} {benefit.frequency}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.schemeDetailCard}>
        <Text style={styles.cardTitle}>How to Apply</Text>
        <Text style={styles.instructionText}>
          1. Ensure all required documents are ready{'\n'}
          2. Visit the nearest service center{'\n'}
          3. Submit the application form{'\n'}
          4. Track your status in "My Applications"
        </Text>
      </View>

      <View style={styles.schemeDetailCard}>
        <Text style={styles.cardTitle}>Required Documents</Text>
        <Text style={styles.documentItem}>✓ Aadhaar Card</Text>
        <Text style={styles.documentItem}>✓ Bank Account Details</Text>
        <Text style={styles.documentItem}>✓ Income Certificate</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleEnroll}
        disabled={enrolling}
      >
        {enrolling ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>🎯 Apply Now</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// ============================================================================
// SCREEN 5: ENROLLMENT/STATUS TRACKER SCREEN
// ============================================================================

export const StatusTrackerScreen = ({ route }) => {
  const { beneficiaryId } = route.params;
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollmentStatus();
  }, []);

  const fetchEnrollmentStatus = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/enrollment/status`,
        {
          headers: { 'X-Beneficiary-ID': beneficiaryId },
        }
      );

      if (response.data.success) {
        setEnrollments(response.data.enrollments);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Your Applications</Text>

      {enrollments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No applications yet</Text>
        </View>
      ) : (
        enrollments.map((enrollment, idx) => (
          <View key={idx} style={styles.enrollmentCard}>
            <View style={styles.enrollmentHeader}>
              <Text style={styles.enrollmentScheme}>
                {enrollment.SCHEME_NAME}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  enrollment.STATUS === 'Active'
                    ? styles.statusActive
                    : styles.statusPending,
                ]}
              >
                <Text style={styles.statusText}>{enrollment.STATUS}</Text>
              </View>
            </View>
            <Text style={styles.enrollmentDate}>
              Applied: {new Date(enrollment.ENROLLMENT_DATE).toLocaleDateString()}
            </Text>
            {enrollment.ANNUAL_BENEFIT_RECEIVED && (
              <Text style={styles.enrollmentBenefit}>
                ₹{enrollment.ANNUAL_BENEFIT_RECEIVED?.toLocaleString('en-IN')}
                /year
              </Text>
            )}
          </View>
        ))
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={fetchEnrollmentStatus}>
        <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  dashboardHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 20,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  eligibleCount: {
    fontSize: 16,
    color: '#FFE082',
    marginTop: 10,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: 'space-around',
  },
  actionCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 10,
  },
  schemeCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  schemeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  schemeCode: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  schemeDomain: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 3,
    fontWeight: '600',
  },
  benefitAmount: {
    alignItems: 'flex-end',
  },
  benefitLabel: {
    fontSize: 12,
    color: '#28A745',
  },
  benefitValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28A745',
  },
  benefitFreq: {
    fontSize: 10,
    color: '#666',
  },
  button: {
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#6C757D',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formSection: {
    padding: 15,
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 8,
    fontSize: 14,
  },
  languageSelector: {
    padding: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
  },
  languageButtonActive: {
    backgroundColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  languageButtonTextActive: {
    color: '#FFF',
  },
  recordingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#28A745',
    padding: 20,
    borderRadius: 50,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#DC3545',
  },
  recordButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  resultContainer: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultTranscription: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
  resultSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
  },
  resultSchemeCard: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
  resultSchemeName: {
    fontWeight: '600',
  },
  resultSchemeAmount: {
    color: '#28A745',
    fontWeight: 'bold',
  },
  resultResponse: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    marginTop: 10,
  },
  schemeDetailHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 20,
  },
  schemeDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  schemeDetailCode: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  schemeDetailBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  schemeDetailCard: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  benefitName: {
    fontSize: 14,
    color: '#333',
  },
  benefitInfo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28A745',
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 22,
    color: '#555',
  },
  documentItem: {
    fontSize: 13,
    paddingVertical: 6,
    color: '#333',
  },
  enrollmentCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  enrollmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enrollmentScheme: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusActive: {
    backgroundColor: '#D4EDDA',
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  enrollmentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  enrollmentBenefit: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28A745',
    marginTop: 8,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
