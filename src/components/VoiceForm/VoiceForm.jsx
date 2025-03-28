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

    useEffect(() => {

        if (voiceActor) {
            return () => voiceActor.stop(); // Clean up when unmounting
        }
        
        
      }, [voiceActor]);
    // This is to start-up the voiceForm, default doubleClick first.
    const initializeActor = () => {
        const actor = createActor(voiceForm);
        actor.subscribe((snapshot) => setCurrentState(snapshot.value));
        actor.start();
        setVoiceActor(actor);
    };

    const [isPressing, setIsPressing] = useState(false);
    const [transcription, setTranscription] = useState('');
    const recognitionRef = useRef(null);
    const transcriptionRef = useRef('');
    const clickTimeout = useRef(null); // Timeout for detecting double clicks
    const pressTimer = useRef(null);   // Timer for long press detection
    const DOUBLE_CLICK_DELAY = 300;    // Time window for double click
    const LONG_PRESS_DELAY = 500;      // Time window for press-and-hold

    // Initialize Speech Recognition
    useEffect(() => {
        recognitionRef.current = initSpeechRecognition(setTranscription, transcriptionRef);
        return () => recognitionRef.current?.stop();
    }, []);

    // Handle Mouse Down (Start Pressing)
    const handleMouseDown = (e) => {
        e.preventDefault();

        // Clear double-click detection timeout
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
        }

        // Set up long press detection
        pressTimer.current = setTimeout(() => {
            const isSpeaking = voiceActor?.getSnapshot().context.is_speaking;
            if (!isSpeaking && currentState && recognitionRef.current && !isPressing) {
                console.log("Starting speech recognition...");
                recognitionRef.current?.start();
                setIsPressing(true);
            }
        }, LONG_PRESS_DELAY);
    };

    // Handle Mouse Up (Stop Pressing or Detect Click)
    const handleRelease = (e) => {
        e.preventDefault();

        if (pressTimer.current) {
            clearTimeout(pressTimer.current); // Stop the long press detection
        }

        if (isPressing && recognitionRef.current) {
            console.log("Stopping speech recognition...");
            recognitionRef.current?.stop();

            // Ensure the final transcript is captured
            setTimeout(() => {
                const latestTranscript = transcriptionRef.current;
                console.log('Final Transcript:', latestTranscript);

                const state = voiceActor.getSnapshot();
                const type = state.context.answered ? 'CONFIRM' : 'ANSWER';
                voiceActor.send({ type, response: latestTranscript });

                setIsPressing(false);
                setTranscription('');
                transcriptionRef.current = '';
            }, 300);
        }

        // Set up a timeout to detect a double click
        clickTimeout.current = setTimeout(() => {
            clickTimeout.current = null; // Reset the timeout after execution
        }, DOUBLE_CLICK_DELAY);
    };

    // Handle Double Click
    const handleDoubleClick = (e) => {
        e.preventDefault();

        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current); // Prevent conflict with single click
            clickTimeout.current = null; // Reset double click timeout

            if (!voiceActor) {
                initializeActor();
            } else {
                const state = voiceActor.getSnapshot();
                console.log(state);

                if (state.value === 'done') {
                    const form = state.context.form;
                    const form_with_id = { ...form, type: state.id };
                    onSubmit(form_with_id);
                } else {
                    voiceActor.send({ type : "RESET" });
                }
            }
        }
    };

    return (
        <div className='voiceForm'
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleRelease}
            onMouseOut={handleRelease}
        >
            <h1>Consultation Machine</h1>
            <div>
                <p>Current State: {currentState}</p>
                <p><strong>Transcription:</strong> {transcription || "Start speaking..."}</p>
            </div>
        </div>
    )
}

export default VoiceForm;