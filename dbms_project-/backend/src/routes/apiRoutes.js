// ============================================================================
// VOICE API ROUTE
// POST /api/v1/voice/query - Core Innovation Endpoint
// ============================================================================

const express = require('express');
const router = express.Router();
const { processVoiceQuery, processVoiceQueryWithKeywordFallback } = require('../services/voiceService');

// Middleware for authentication
const authenticateUser = (req, res, next) => {
  // TODO: Implement JWT verification
  req.beneficiaryId = req.body.beneficiary_id || req.headers['x-beneficiary-id'];
  if (!req.beneficiaryId) {
    return res.status(401).json({ error: 'Beneficiary ID required' });
  }
  next();
};

// ============================================================================
// ENDPOINT: POST /api/v1/voice/query
// Process voice query using AI/LLM Pipeline
// ============================================================================
router.post('/query', authenticateUser, async (req, res) => {
  try {
    const { audio_base64, language_code } = req.body;
    const beneficiaryId = req.beneficiaryId;

    if (!audio_base64) {
      return res.status(400).json({ error: 'audio_base64 is required' });
    }

    // Convert base64 to buffer
    const audioContent = Buffer.from(audio_base64, 'base64');

    // Process voice query through AI pipeline
    const result = await processVoiceQuery(
      audioContent,
      beneficiaryId,
      language_code || 'pa-IN'
    );

    if (!result.success) {
      // Fallback to keyword-based search
      console.log('[VOICE API] LLM pipeline failed, using keyword fallback...');
      const fallbackResult = await processVoiceQueryWithKeywordFallback(
        audioContent,
        beneficiaryId,
        language_code || 'pa-IN'
      );
      
      return res.json({
        success: true,
        method: 'KEYWORD_FALLBACK',
        data: fallbackResult,
      });
    }

    res.json({
      success: true,
      method: 'AI_PIPELINE',
      data: {
        transcription: result.pipeline.step1_transcription,
        intent: result.pipeline.step3_intent,
        schemesFound: result.output.resultsCount,
        schemes: result.output.schemes,
        responseText: result.pipeline.step6_formattedText,
        audioBase64: result.pipeline.step7_audioBase64,
      },
    });
  } catch (error) {
    console.error('[VOICE API] Error:', error);
    res.status(500).json({
      error: 'Voice query processing failed',
      message: error.message,
    });
  }
});

// ============================================================================
// ENDPOINT: POST /api/v1/voice/audio-upload
// Upload and process audio file
// ============================================================================
router.post('/audio-upload', authenticateUser, async (req, res) => {
  try {
    const beneficiaryId = req.beneficiaryId;
    const audioFile = req.files?.audio;

    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const audioContent = audioFile.data;

    const result = await processVoiceQuery(
      audioContent,
      beneficiaryId,
      req.body.language_code || 'pa-IN'
    );

    res.json({
      success: result.success,
      data: result.success ? result.output : result.error,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ENDPOINT: GET /api/v1/voice/supported-languages
// Get supported languages for voice queries
// ============================================================================
router.get('/supported-languages', (req, res) => {
  res.json({
    success: true,
    languages: [
      { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
      { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'en-IN', name: 'English', nativeName: 'English' },
      { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
      { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
    ],
  });
});

module.exports = router;

// ============================================================================
// BENEFICIARY API ROUTES
// ============================================================================

const beneficiaryRouter = express.Router();

// POST /api/v1/beneficiary/register
beneficiaryRouter.post('/register', async (req, res) => {
  try {
    const {
      first_name, last_name, date_of_birth, gender,
      annual_income, occupation_id, location_id,
      phone_number, email, aadhaar_number
    } = req.body;

    // TODO: Validate input
    // TODO: Insert into BENEFICIARY table

    res.status(201).json({
      success: true,
      message: 'Beneficiary registered successfully',
      beneficiaryId: 1, // Generated ID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/beneficiary/:id
beneficiaryRouter.get('/:id', async (req, res) => {
  try {
    const beneficiaryId = req.params.id;
    // TODO: Fetch beneficiary details
    res.json({ beneficiaryId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ELIGIBILITY API ROUTES
// ============================================================================

const eligibilityRouter = express.Router();

// POST /api/v1/beneficiary/eligibility
eligibilityRouter.post('/', authenticateUser, async (req, res) => {
  try {
    const { EligibilityService } = require('../services/backendServices');
    const service = new EligibilityService();

    const result = await service.calculateEligibility(req.beneficiaryId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/beneficiary/eligible-schemes
eligibilityRouter.get('/schemes', authenticateUser, async (req, res) => {
  try {
    const { EligibilityService } = require('../services/backendServices');
    const service = new EligibilityService();

    const result = await service.getEligibleSchemes(req.beneficiaryId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ENROLLMENT API ROUTES
// ============================================================================

const enrollmentRouter = express.Router();

// POST /api/v1/enrollment/apply
enrollmentRouter.post('/apply', authenticateUser, async (req, res) => {
  try {
    const { scheme_id } = req.body;
    const { EnrollmentService } = require('../services/backendServices');
    const service = new EnrollmentService();

    const result = await service.enrollBeneficiary(req.beneficiaryId, scheme_id);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/enrollment/status
enrollmentRouter.get('/status', authenticateUser, async (req, res) => {
  try {
    const { EnrollmentService } = require('../services/backendServices');
    const service = new EnrollmentService();

    const result = await service.getEnrollmentStatus(req.beneficiaryId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ANALYTICS API ROUTES
// ============================================================================

const analyticsRouter = express.Router();

// GET /api/v1/analytics/gap-report
analyticsRouter.get('/gap-report', authenticateUser, async (req, res) => {
  try {
    const { AnalyticsService } = require('../services/backendServices');
    const service = new AnalyticsService();

    const result = await service.getGapAnalysis(req.beneficiaryId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/analytics/scheme/:id/metrics
analyticsRouter.get('/scheme/:id/metrics', async (req, res) => {
  try {
    const { AnalyticsService } = require('../services/backendServices');
    const service = new AnalyticsService();

    const result = await service.getSchemeMetrics(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/analytics/campaign/:id/report
analyticsRouter.get('/campaign/:id/report', async (req, res) => {
  try {
    const { AnalyticsService } = require('../services/backendServices');
    const service = new AnalyticsService();

    const result = await service.getCampaignReport(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  voice: router,
  beneficiary: beneficiaryRouter,
  eligibility: eligibilityRouter,
  enrollment: enrollmentRouter,
  analytics: analyticsRouter,
};
