import React, { useEffect, useState, useRef } from 'react';
import { initSpeechRecognition } from '../../utils/speechUtils';
import { createActor } from 'xstate';
import './VoiceForm.css';

/**
 * 
 * @param {voiceForm} : This is the your voice form
 * @param {onSubmit} : This is a callback function to call when submitting the voiceform.
 * @param {config} : We will configuration in the future to allow more flexible gestures.
 * @returns 
 */
function VoiceForm({voiceForm, onSubmit, config}) {

    // The voiceActor object.
    const [currentState, setCurrentState] = useState(null);
    const [voiceActor, setVoiceActor] = useState(null);

    // This is to start-up the voiceForm, default doubleClick first.
    const initializeActor = () => {
        const actor = createActor(voiceForm);
        actor.subscribe((snapshot) => setCurrentState(snapshot.value));
        actor.start();
        setVoiceActor(actor);
    };

    // Responder's state machine
    const [isPressing, setIsPressing] = useState(false);
    const [transcription, setTranscription] = useState('');
    const recognitionRef = useRef(null);
    
    // Initialize Speech Recognition
    useEffect(() => {
        recognitionRef.current = initSpeechRecognition(setTranscription);
        return () => recognitionRef.current?.stop();
    }, []);

    // Mouse Events for Speech Recording
    const handleMouseDown = () => {
        const isSpeaking = voiceActor?.getSnapshot().context.is_speaking;
        if (!isSpeaking && currentState && recognitionRef.current && !isPressing) {
            recognitionRef.current?.start();
            setIsPressing(true);
        }
    };

    const handleRelease = () => {
        if (recognitionRef.current && isPressing) {
            recognitionRef.current?.stop();
            const type = state.context.answered ? 'CONFIRM' : 'ANSWER';
            voiceActor.send({ type : type, response : transcription });
            setIsPressing(false);        
        }
    };

    const handleDoubleClick = () => {
        if (!voiceActor) {
            initializeActor();
        }
    }

    return (
        <div>
            <h1>Consultation Machine</h1>
            <div>
                <p>Current State: {currentState}</p>
                <p><strong>Transcription:</strong> {transcription || "Start speaking..."}</p>
            </div>

            <div className="reactive_screen"
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleRelease}
                onMouseOut={handleRelease}
            ></div>
        </div>
    )
}

export default VoiceForm;