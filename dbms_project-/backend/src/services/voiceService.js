// ============================================================================
// STAGE 3: VOICE SERVICE - AI/LLM PIPELINE ORCHESTRATION
// Voice Query Processing: Speech → Intent → SQL → Response → Speech
// ============================================================================

const {
  speechToText,
  textToSpeechConverter,
  extractIntentFromText,
  formatResultsToNaturalLanguage,
  validateGeneratedSQL,
} = require('../../config/llm');

const { getOracleConnection } = require('../db/oracleConnection');

// ============================================================================
// CORE FUNCTION: Process Voice Query (End-to-End)
// ============================================================================
async function processVoiceQuery(
  audioContent,
  beneficiaryId,
  languageCode = 'pa-IN'
) {
  try {
    console.log('[VOICE PIPELINE] Starting voice query processing...');
    
    // STEP 1: Speech-to-Text
    console.log('[STEP 1] Converting audio to text...');
    const sttResult = await speechToText(audioContent, languageCode);
    
    if (!sttResult.success) {
      throw new Error(`Speech recognition failed: ${sttResult.error}`);
    }
    
    const userQuery = sttResult.text;
    console.log(`[STEP 1] ✓ Transcription: "${userQuery}"`);
    console.log(`[STEP 1] ✓ Confidence: ${sttResult.confidence * 100}%`);
    
    // STEP 2: Get Beneficiary Context
    console.log('[STEP 2] Fetching beneficiary context...');
    const beneficiaryContext = await getBeneficiaryContext(beneficiaryId);
    console.log(`[STEP 2] ✓ Beneficiary: ${beneficiaryContext.first_name} ${beneficiaryContext.last_name}`);
    
    // STEP 3: Intent Extraction (GPT-4)
    console.log('[STEP 3] Extracting intent using GPT-4...');
    const intentResult = await extractIntentFromText(userQuery, beneficiaryContext);
    
    if (!intentResult.success) {
      throw new Error(`Intent extraction failed: ${intentResult.error}`);
    }
    
    const intent = intentResult.intent;
    console.log(`[STEP 3] ✓ Detected intent: ${intent.query_type}`);
    console.log(`[STEP 3] ✓ Parameters:`, intent);
    
    // STEP 4: Generate & Validate SQL Query
    console.log('[STEP 4] Generating SQL query...');
    const sqlQuery = generateSQLQuery(beneficiaryId, intent);
    
    const sqlValidation = validateGeneratedSQL(sqlQuery);
    if (!sqlValidation.valid) {
      throw new Error(`SQL validation failed: ${sqlValidation.error}`);
    }
    console.log(`[STEP 4] ✓ SQL Query generated and validated`);
    console.log(`[STEP 4] ✓ Query: ${sqlQuery.substring(0, 100)}...`);
    
    // STEP 5: Execute Oracle Query
    console.log('[STEP 5] Executing query on Oracle database...');
    const queryResults = await executeOracleQuery(sqlQuery, beneficiaryId);
    console.log(`[STEP 5] ✓ Retrieved ${queryResults.length} results`);
    
    // STEP 6: Format Results to Natural Language (GPT-4)
    console.log('[STEP 6] Formatting results using GPT-4...');
    const formattedResponse = await formatResultsToNaturalLanguage(
      queryResults,
      `${beneficiaryContext.first_name} ${beneficiaryContext.last_name}`,
      languageCode
    );
    
    if (!formattedResponse.success) {
      throw new Error(`Response formatting failed: ${formattedResponse.error}`);
    }
    console.log(`[STEP 6] ✓ Response formatted in ${languageCode}`);
    
    // STEP 7: Text-to-Speech (Google Cloud)
    console.log('[STEP 7] Converting response to speech...');
    const ttsResult = await textToSpeechConverter(
      formattedResponse.text,
      languageCode,
      'FEMALE'
    );
    
    if (!ttsResult.success) {
      throw new Error(`Text-to-speech failed: ${ttsResult.error}`);
    }
    console.log(`[STEP 7] ✓ Audio generated (MP3)`);
    
    // STEP 8: Log to Database
    console.log('[STEP 8] Logging query to database...');
    await logVoiceQuery(
      beneficiaryId,
      userQuery,
      intent.query_type,
      queryResults.length,
      'SUCCESS'
    );
    console.log(`[STEP 8] ✓ Query logged`);
    
    console.log('[VOICE PIPELINE] ✓ Pipeline completed successfully!');
    
    // Return complete response
    return {
      success: true,
      pipeline: {
        step1_transcription: userQuery,
        step2_beneficiary: beneficiaryContext.first_name,
        step3_intent: intent,
        step4_query: sqlQuery,
        step5_results: queryResults,
        step6_formattedText: formattedResponse.text,
        step7_audioBase64: ttsResult.audioContent.toString('base64'),
      },
      output: {
        text: formattedResponse.text,
        audioFormat: 'MP3',
        resultsCount: queryResults.length,
        schemes: queryResults,
      },
    };
  } catch (error) {
    console.error('[VOICE PIPELINE] ✗ Pipeline failed:', error.message);
    
    // Log error
    await logVoiceQuery(
      beneficiaryId,
      'VOICE_QUERY_ERROR',
      'ERROR',
      0,
      `FAILED: ${error.message}`
    );
    
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================================
// UTILITY: Generate SQL Query from Intent
// ============================================================================
function generateSQLQuery(beneficiaryId, intent) {
  let query = `
    SELECT 
      ps.scheme_id,
      ps.scheme_name,
      ps.scheme_code,
      ps.description,
      ps.min_annual_benefit,
      ps.max_annual_benefit,
      sd.domain_name,
      em.eligibility_score,
      em.is_eligible,
      COALESCE(be.status, 'Not Enrolled') as enrollment_status,
      COUNT(sb.benefit_id) as benefits_count
    FROM POLICY_SCHEME ps
    JOIN SCHEME_DOMAIN sd ON ps.domain_id = sd.domain_id
    LEFT JOIN ELIGIBILITY_MATCH em ON ps.scheme_id = em.scheme_id 
      AND em.beneficiary_id = :beneficiary_id
    LEFT JOIN BENEFICIARY_ENROLLMENT be ON ps.scheme_id = be.scheme_id 
      AND be.beneficiary_id = :beneficiary_id
    LEFT JOIN SCHEME_BENEFIT sb ON ps.scheme_id = sb.scheme_id
    WHERE ps.status = 'Active'
  `;
  
  // Add filters based on intent
  if (intent.query_type === 'eligibility_check') {
    query += ` AND em.is_eligible = 'Y'`;
  }
  
  if (intent.scheme_name) {
    query += ` AND LOWER(ps.scheme_name) LIKE LOWER(:scheme_name)`;
  }
  
  query += ` GROUP BY ps.scheme_id, ps.scheme_name, ps.scheme_code, ps.description,
              ps.min_annual_benefit, ps.max_annual_benefit, sd.domain_name,
              em.eligibility_score, em.is_eligible, be.status
             ORDER BY em.eligibility_score DESC, ps.max_annual_benefit DESC`;
  
  return query;
}

// ============================================================================
// UTILITY: Get Beneficiary Context
// ============================================================================
async function getBeneficiaryContext(beneficiaryId) {
  const connection = await getOracleConnection();
  
  try {
    const result = await connection.execute(
      `SELECT 
        beneficiary_id, aadhaar_number, first_name, last_name, 
        date_of_birth, gender, marital_status, annual_income,
        occupation_id, bpl_status, location_id
       FROM BENEFICIARY 
       WHERE beneficiary_id = :beneficiary_id`,
      { beneficiary_id: beneficiaryId }
    );
    
    if (result.rows.length === 0) {
      throw new Error('Beneficiary not found');
    }
    
    return result.rows[0];
  } finally {
    await connection.close();
  }
}

// ============================================================================
// UTILITY: Execute Oracle Query
// ============================================================================
async function executeOracleQuery(sqlQuery, beneficiaryId) {
  const connection = await getOracleConnection();
  
  try {
    const result = await connection.execute(
      sqlQuery,
      { beneficiary_id: beneficiaryId },
      { outFormat: 3 } // OBJECT format
    );
    
    return result.rows || [];
  } finally {
    await connection.close();
  }
}

// ============================================================================
// UTILITY: Log Voice Query
// ============================================================================
async function logVoiceQuery(
  beneficiaryId,
  userQuery,
  queryType,
  resultsCount,
  status
) {
  try {
    const connection = await getOracleConnection();
    
    await connection.execute(
      `INSERT INTO AUDIT_LOG (
        audit_id, table_name, operation, record_id, 
        old_values, new_values, changed_by, changed_at
      ) VALUES (
        seq_audit_id.NEXTVAL, 'VOICE_QUERY', 'VOICE_QUERY', :beneficiary_id,
        :query, :metadata, 'VOICE_API', SYSDATE
      )`,
      {
        beneficiary_id: beneficiaryId,
        query: userQuery,
        metadata: JSON.stringify({
          query_type: queryType,
          results_count: resultsCount,
          status: status,
        }),
      }
    );
    
    await connection.commit();
    await connection.close();
  } catch (error) {
    console.error('Error logging voice query:', error.message);
  }
}

// ============================================================================
// ALTERNATIVE: Simple Keyword-Based Fallback (No LLM Required)
// ============================================================================
async function processVoiceQueryWithKeywordFallback(
  audioContent,
  beneficiaryId,
  languageCode = 'pa-IN'
) {
  try {
    // Convert speech to text
    const sttResult = await speechToText(audioContent, languageCode);
    if (!sttResult.success) {
      return { success: false, error: 'Speech recognition failed' };
    }
    
    const query = sttResult.text.toUpperCase();
    let sqlQuery = `
      SELECT scheme_name, max_annual_benefit, description
      FROM POLICY_SCHEME
      WHERE status = 'Active'
    `;
    
    // Simple keyword matching
    if (query.includes('PENSION')) {
      sqlQuery += ` AND scheme_code IN ('IGNOAP', 'IGNWPS', 'IGNDS')`;
    } else if (query.includes('FARMER') || query.includes('AGRICULTURE')) {
      sqlQuery += ` AND domain_id = 2`;
    } else if (query.includes('HEALTH')) {
      sqlQuery += ` AND domain_id = 1`;
    }
    
    sqlQuery += ` ORDER BY max_annual_benefit DESC LIMIT 5`;
    
    const results = await executeOracleQuery(sqlQuery, beneficiaryId);
    
    // Convert back to speech
    let responseText = `You are eligible for these schemes: ${results.map(r => r.SCHEME_NAME).join(', ')}`;
    const ttsResult = await textToSpeechConverter(responseText, languageCode);
    
    return {
      success: true,
      method: 'KEYWORD_FALLBACK',
      results,
      audioBase64: ttsResult.audioContent.toString('base64'),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  processVoiceQuery,
  processVoiceQueryWithKeywordFallback,
  getBeneficiaryContext,
  executeOracleQuery,
  logVoiceQuery,
};
