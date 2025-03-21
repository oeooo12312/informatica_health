// components/ConsultationMachine/speechUtils.js

// Helper to speak a single character
const speakChar = (char, delay, voice, synth) => {
    const charUtterance = new SpeechSynthesisUtterance(char);
    charUtterance.lang = 'en-US';
    charUtterance.voice = voice;
    setTimeout(() => synth.speak(charUtterance), delay);
};

export const textToSpeech = (text, audio, character, onEnd) => {
    if (!window.speechSynthesis) {
        console.error('Speech Synthesis not supported in this browser.');
        return;
    }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const voice = voices.find((v) => v.lang === 'en-US') || voices[0];

    let totalDelay = 0; // Track the total delay across characters for the last call

    if (character) {
        // Speak each character with a delay
        for (let i = 0; i < text.length; i++) {
            // Speak character after the delay
            speakChar(text[i], totalDelay, voice, synth);
            totalDelay += 300; // 300ms delay between characters (adjust as needed)
        }

        // Set a timeout after the final character to trigger onEnd
        setTimeout(() => {
            audio?.play();  // Play beep sound
            if (onEnd) onEnd();  // Call onEnd after the last character
        }, totalDelay + 100); // Ensure a slight buffer after the final character
    } else {
        // Speak the entire text at once
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.voice = voice;
        utterance.onend = () => {
            audio?.play();
            if (onEnd) onEnd();
        };

        synth.speak(utterance);
    }
};

// Initialize Speech Recognition
// takes in the setTranscription function from react useState.
export const initSpeechRecognition = (setTranscription) => {
    if (!('webkitSpeechRecognition' in window)) {
        console.error('Speech Recognition not supported');
        return null;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        setTranscription(transcript);
    };

    recognition.onerror = (error) => console.error('Speech Recognition Error:', error);

    return recognition;
};