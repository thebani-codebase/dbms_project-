// ============================================================================
// VOICE QUERY INTEGRATION - YOGNA SATHI + DBMS DONORS
// ============================================================================

// Voice Query Integration Functions
const VoiceIntegration = {
  // Process voice query using DBMS Donors backend
  processVoiceQuery: async (audioData, beneficiaryId, languageCode = 'pa-IN') => {
    try {
      // Check if DBMS Donors backend is available
      if (window.API && window.IntegrationConfig.ACTIVE_API === "DBMS") {
        const response = await API.post(window.Endpoints.VOICE.QUERY, {
          audio_base64: audioData,
          beneficiary_id: beneficiaryId,
          language_code: languageCode
        });
        
        return {
          success: true,
          source: "DBMS Donors Voice Pipeline",
          data: response.data,
          transcription: response.data.transcription,
          schemes: response.data.schemesFound || [],
          responseText: response.data.responseText,
          audioResponse: response.data.audioBase64
        };
      }
      
      // Fallback to mock voice processing
      return VoiceIntegration.mockVoiceProcessing(audioData, beneficiaryId, languageCode);
      
    } catch (error) {
      console.error('Voice query failed:', error);
      return {
        success: false,
        error: error.message,
        source: "Voice Integration Error"
      };
    }
  },
  
  // Mock voice processing for fallback
  mockVoiceProcessing: async (audioData, beneficiaryId, languageCode) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResponses = {
      'pa-IN': {
        transcription: "ਮੈਂ 65 ਸਾਲ ਦੀ ਵਿਧਵਾ ਹਾਂ, ਮੈਨੂੰ ਕਿਹੜੀਆਂ ਯੋਜਨਾਵਾਂ ਮਿਲਦੀਆਂ ਹਨ?",
        responseText: "ਤੁਹਾਨੂੰ 3 ਯੋਜਨਾਵਾਂ ਮਿਲ ਸਕਦੀਆਂ ਹਨ: ਵਿਧਵਾ ਪੈਨਸ਼ਨ, ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ, ਅਤੇ ਯੂਜਵਾਲਾ ਯੋਜਨਾ।",
        schemes: [
          { name: "Indira Gandhi National Widow Pension", benefit: "Rs 18,000/year" },
          { name: "Ayushman Bharat PM-JAY", benefit: "Rs 5,00,000 cover" },
          { name: "Ujjwala Yojana", benefit: "Free LPG connection" }
        ]
      },
      'hi-IN': {
        transcription: "मैं 65 साल की विधवा हूं, मुझे कौन सी योजनाएं मिल सकती हैं?",
        responseText: "आपको 3 योजनाएं मिल सकती हैं: विधवा पेंशन, आयुष्मान भारत, और उज्ज्वला योजना।",
        schemes: [
          { name: "Indira Gandhi National Widow Pension", benefit: "Rs 18,000/year" },
          { name: "Ayushman Bharat PM-JAY", benefit: "Rs 5,00,000 cover" },
          { name: "Ujjwala Yojana", benefit: "Free LPG connection" }
        ]
      },
      'en-IN': {
        transcription: "I am a 65 year old widow, which schemes can I get?",
        responseText: "You are eligible for 3 schemes: Widow Pension, Ayushman Bharat, and Ujjwala Yojana.",
        schemes: [
          { name: "Indira Gandhi National Widow Pension", benefit: "Rs 18,000/year" },
          { name: "Ayushman Bharat PM-JAY", benefit: "Rs 5,00,000 cover" },
          { name: "Ujjwala Yojana", benefit: "Free LPG connection" }
        ]
      }
    };
    
    const response = mockResponses[languageCode] || mockResponses['en-IN'];
    
    return {
      success: true,
      source: "Mock Voice Processing (Fallback)",
      data: {
        transcription: response.transcription,
        responseText: response.responseText,
        schemesFound: response.schemes.length,
        schemes: response.schemes
      },
      transcription: response.transcription,
      schemes: response.schemes,
      responseText: response.responseText
    };
  },
  
  // Get supported languages from DBMS Donors
  getSupportedLanguages: async () => {
    try {
      if (window.API && window.IntegrationConfig.ACTIVE_API === "DBMS") {
        const response = await API.get(window.Endpoints.VOICE.SUPPORTED_LANGUAGES);
        return response.data || [
          { code: 'pa-IN', name: 'Punjabi', supported: true },
          { code: 'hi-IN', name: 'Hindi', supported: true },
          { code: 'en-IN', name: 'English', supported: true }
        ];
      }
      
      // Fallback languages
      return [
        { code: 'pa-IN', name: 'Punjabi', supported: true },
        { code: 'hi-IN', name: 'Hindi', supported: true },
        { code: 'en-IN', name: 'English', supported: true }
      ];
      
    } catch (error) {
      console.error('Failed to get supported languages:', error);
      return [
        { code: 'en-IN', name: 'English', supported: true }
      ];
    }
  },
  
  // Convert audio to base64
  audioToBase64: (audioBlob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:audio/webm;base64, prefix
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  },
  
  // Start voice recording
  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioBase64 = await VoiceIntegration.audioToBase64(audioBlob);
        
        // Trigger voice processing event
        window.dispatchEvent(new CustomEvent('voiceRecorded', {
          detail: { audioBase64, audioBlob }
        }));
      };
      
      mediaRecorder.start();
      return { mediaRecorder, stream };
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  },
  
  // Stop voice recording
  stopRecording: (mediaRecorder, stream) => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  },
  
  // Text-to-speech using browser API (fallback)
  speakText: (text, language = 'en-IN') => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language
        const langMap = {
          'pa-IN': 'pa-IN',
          'hi-IN': 'hi-IN',
          'en-IN': 'en-IN'
        };
        utterance.lang = langMap[language] || 'en-IN';
        
        // Set voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.lang.includes(language.split('-')[0]) && voice.name.includes('Female')
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        
        speechSynthesis.speak(utterance);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      return false;
    }
  }
};

// Enhanced voice UI integration
const VoiceUI = {
  // Initialize voice interface
  init: () => {
    // Add voice recording styles if not exists
    if (!document.getElementById('voice-styles')) {
      const style = document.createElement('style');
      style.id = 'voice-styles';
      style.textContent = `
        .voice-recording {
          background: linear-gradient(45deg, #ff6b6b, #ee5a24) !important;
          animation: pulse 1.5s infinite;
        }
        
        .voice-recording::after {
          content: '🔴 Recording...';
          position: absolute;
          top: -25px;
          right: 10px;
          background: #ff6b6b;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .voice-processing {
          background: #f39c12 !important;
          position: relative;
          overflow: hidden;
        }
        
        .voice-processing::after {
          content: '⏳ Processing...';
          position: absolute;
          top: -25px;
          right: 10px;
          background: #f39c12;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .voice-result {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          padding: 12px;
          margin: 10px 0;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Listen for voice recorded events
    window.addEventListener('voiceRecorded', VoiceUI.handleVoiceRecorded);
  },
  
  // Handle recorded voice
  handleVoiceRecorded: async (event) => {
    const { audioBase64 } = event.detail;
    const beneficiaryId = window.state?.user?.id || 1;
    const language = 'pa-IN'; // Default to Punjabi
    
    // Show processing state
    const button = document.querySelector('[data-action="listen"]');
    if (button) {
      button.classList.add('voice-processing');
      button.textContent = '⏳ Processing...';
    }
    
    try {
      const result = await VoiceIntegration.processVoiceQuery(audioBase64, beneficiaryId, language);
      
      if (result.success) {
        // Update UI with results
        VoiceUI.displayVoiceResult(result);
        
        // Update assistant text
        const textarea = document.getElementById('assistantText');
        if (textarea) {
          textarea.value = result.transcription;
        }
        
        // Update matches
        if (result.schemes && window.state) {
          window.state.matches = result.schemes;
          window.render();
        }
        
        // Auto-speak response
        setTimeout(() => {
          VoiceIntegration.speakText(result.responseText, language);
        }, 1000);
        
      } else {
        window.toast(`Voice query failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Voice processing error:', error);
      window.toast('Voice processing failed. Please try again.');
    } finally {
      // Reset button state
      if (button) {
        button.classList.remove('voice-processing');
        button.textContent = '🎙️ Mic';
      }
    }
  },
  
  // Display voice result
  displayVoiceResult: (result) => {
    const existingResult = document.querySelector('.voice-result');
    if (existingResult) {
      existingResult.remove();
    }
    
    const resultDiv = document.createElement('div');
    resultDiv.className = 'voice-result';
    resultDiv.innerHTML = `
      <strong>🎤 Voice Query Result (${result.source})</strong>
      <p><strong>Transcription:</strong> ${result.transcription}</p>
      <p><strong>Response:</strong> ${result.responseText}</p>
      <p><strong>Schemes Found:</strong> ${result.schemes.length}</p>
      ${result.schemes.length > 0 ? `
        <div style="margin-top: 10px;">
          <strong>Matched Schemes:</strong>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${result.schemes.map(scheme => `<li>${scheme.name} - ${scheme.benefit}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
    
    // Insert after voice box
    const voiceBox = document.querySelector('.voice-box');
    if (voiceBox) {
      voiceBox.parentNode.insertBefore(resultDiv, voiceBox.nextSibling);
    }
  }
};

// Export for global use
window.VoiceIntegration = VoiceIntegration;
window.VoiceUI = VoiceUI;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', VoiceUI.init);
} else {
  VoiceUI.init();
}
