// ============================================================================
// STAGE 3: LLM & CLOUD APIS CONFIGURATION
// GPT-4 Integration + Google Cloud Speech/Text APIs
// ============================================================================

const axios = require('axios');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');

// ============================================================================
// GPT-4 CONFIGURATION
// ============================================================================
const gpt4Config = {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo',
  baseURL: 'https://api.openai.com/v1',
  maxTokens: 2000,
  temperature: 0.7,
};

// ============================================================================
// GOOGLE CLOUD SPEECH-TO-TEXT CONFIGURATION
// ============================================================================
const speechToTextConfig = {
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE || '/path/to/gcp-key.json',
};

const speechClient = new speech.SpeechClient({
  projectId: speechToTextConfig.projectId,
  keyFilename: speechToTextConfig.keyFilename,
});

// ============================================================================
// GOOGLE CLOUD TEXT-TO-SPEECH CONFIGURATION
// ============================================================================
const textToSpeechConfig = {
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE || '/path/to/gcp-key.json',
};

const textToSpeechClient = new textToSpeech.TextToSpeechClient({
  projectId: textToSpeechConfig.projectId,
  keyFilename: textToSpeechConfig.keyFilename,
});

// ============================================================================
// UTILITY: Speech Recognition (Audio → Text)
// ============================================================================
async function speechToText(audioContent, languageCode = 'pa-IN') {
  try {
    const request = {
      audio: {
        content: audioContent, // Base64 encoded audio
      },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: languageCode, // Punjabi: pa-IN, Hindi: hi-IN
        model: 'latest_long',
      },
    };

    const [response] = await speechClient.recognize(request);
    
    let transcription = '';
    for (const result of response.results) {
      if (result.alternatives[0]) {
        transcription += result.alternatives[0].transcript;
      }
    }
    
    return {
      success: true,
      text: transcription,
      confidence: response.results[0]?.alternatives[0]?.confidence || 0.92,
    };
  } catch (error) {
    console.error('Speech-to-Text Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================================
// UTILITY: Text-to-Speech (Text → Audio)
// ============================================================================
async function textToSpeechConverter(text, languageCode = 'pa-IN', gender = 'FEMALE') {
  try {
    const request = {
      input: { text },
      voice: {
        languageCode: languageCode,
        name: languageCode === 'pa-IN' ? 'hi-IN-Neural2-A' : 'hi-IN-Neural2-C', // Punjabi voices
        ssmlGender: gender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: 0,
        speakingRate: 1.0,
      },
    };

    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    
    return {
      success: true,
      audioContent: response.audioContent, // MP3 bytes
      audioEncoding: 'MP3',
    };
  } catch (error) {
    console.error('Text-to-Speech Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================================
// UTILITY: GPT-4 Intent Extraction (Text → SQL Intent)
// ============================================================================
async function extractIntentFromText(userQuery, beneficiaryContext) {
  try {
    const systemPrompt = `You are an expert at extracting user intent from natural language queries about government schemes.
    
Extract the following from the user query:
1. Age (if mentioned)
2. Gender (if mentioned)
3. Marital Status (if mentioned: Single, Married, Widow, Widower, Divorced)
4. Occupation (if mentioned)
5. Location (if mentioned)
6. Income range (if mentioned)
7. Scheme interest (if mentioned)
8. Query type (eligibility_check, scheme_details, enrollment_help)

Return JSON format only:
{
  "age": null,
  "gender": null,
  "marital_status": null,
  "occupation": null,
  "location": null,
  "income": null,
  "scheme_name": null,
  "query_type": "eligibility_check",
  "confidence": 0.95
}`;

    const userPrompt = `User query: "${userQuery}"
    
    Beneficiary context: ${JSON.stringify(beneficiaryContext)}
    
    Extract intent and return JSON:`;

    const response = await axios.post(
      `${gpt4Config.baseURL}/chat/completions`,
      {
        model: gpt4Config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: gpt4Config.temperature,
      },
      {
        headers: {
          'Authorization': `Bearer ${gpt4Config.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const intent = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');

    return {
      success: true,
      intent,
      rawResponse: content,
    };
  } catch (error) {
    console.error('Intent Extraction Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================================
// UTILITY: GPT-4 Response Formatter (Results → Natural Language)
// ============================================================================
async function formatResultsToNaturalLanguage(schemes, beneficiaryName, languageCode = 'pa-IN') {
  try {
    const systemPrompt = `You are a helpful government scheme assistant. Format database results into natural, conversational text.
    
Be friendly and encouraging. Mention:
1. Number of eligible schemes
2. Key scheme names and benefits
3. Annual benefit amount
4. Next steps for enrollment

Keep response under 150 words.`;

    const userPrompt = `Format this for ${beneficiaryName}:
    
Eligible Schemes:
${schemes.map(s => `- ${s.scheme_name}: ₹${s.max_annual_benefit}/year (${s.description})`).join('\n')}

Respond in ${languageCode === 'pa-IN' ? 'Punjabi' : 'Hindi'} with natural, encouraging tone:`;

    const response = await axios.post(
      `${gpt4Config.baseURL}/chat/completions`,
      {
        model: gpt4Config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.8,
      },
      {
        headers: {
          'Authorization': `Bearer ${gpt4Config.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      text: response.data.choices[0].message.content,
    };
  } catch (error) {
    console.error('Response Formatting Error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================================
// UTILITY: SQL Injection Prevention - Validate Generated SQL
// ============================================================================
const ALLOWED_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT',
  'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'LIMIT'
];

const FORBIDDEN_KEYWORDS = [
  'DROP', 'DELETE', 'INSERT', 'UPDATE', 'TRUNCATE', 'ALTER',
  'CREATE', 'EXEC', 'EXECUTE', 'DECLARE'
];

function validateGeneratedSQL(sql) {
  const upperSQL = sql.toUpperCase();
  
  // Check for forbidden keywords
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (upperSQL.includes(keyword)) {
      return {
        valid: false,
        error: `Forbidden SQL keyword detected: ${keyword}`,
      };
    }
  }
  
  // Check for SQL injection patterns
  const injectionPatterns = [
    /--\s*(.*)/,  // SQL comments
    /;\s*DROP/i,
    /;\s*DELETE/i,
    /UNION\s+SELECT/i,
    /OR\s+1\s*=\s*1/i,
  ];
  
  for (const pattern of injectionPatterns) {
    if (pattern.test(sql)) {
      return {
        valid: false,
        error: 'Potential SQL injection detected',
      };
    }
  }
  
  // Ensure it's a SELECT query
  if (!upperSQL.trim().startsWith('SELECT')) {
    return {
      valid: false,
      error: 'Only SELECT queries allowed',
    };
  }
  
  return {
    valid: true,
  };
}

module.exports = {
  gpt4Config,
  speechToTextConfig,
  textToSpeechConfig,
  speechToText,
  textToSpeechConverter,
  extractIntentFromText,
  formatResultsToNaturalLanguage,
  validateGeneratedSQL,
};
