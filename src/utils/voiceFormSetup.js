import { setup } from "xstate";
import { textToSpeech } from './speechUtils';
import beep from '../assets/beep.wav';

// Helper to manage speech status
const beepAudio = new Audio(beep);
const createSpeechHelpers = () => ({
    startSpeak: (context) => { context.is_speaking = true; },
    endSpeak: (context) => { context.is_speaking = false; },
});

// Factory function to create the voiceFormSetup machine
export const createVoiceFormSetup = ({
    q_map,
    validators,
    state_map,
    states,
    response_by_characters,
}) => {
    const { startSpeak, endSpeak } = createSpeechHelpers();

    return setup({
        // context stores the form dynamic variables.
        context: {
            form: {},
            current_state : -1, // increment 
            current_response: '',
            bot_response: '',
            is_speaking: false,
            answered : false,
        },
        // actions possible for the form
        actions: {
            // Ask the current question
            askQuestion: ({ context }) => {
                context.current_state += 1;
                startSpeak(context);

                textToSpeech(
                    `${q_map[context.current_state]}`,
                    beepAudio,
                    false,
                    () => endSpeak(context)
                );
            },

            // Answer the current question
            answer: ({ context, event }) => {
                startSpeak(context);
                if (event.response) {
                    context.current_response = event.response; // Store the response

                    textToSpeech(
                        'Is the following information,',
                        null,
                        false,
                        () => textToSpeech(
                            event.response,
                            null,
                            response_by_characters[context.current_state],
                            () => textToSpeech(
                                'correct? Please respond with Yes or No after the beep',
                                beepAudio,
                                false,
                                () => { context.answered = true; endSpeak(context); }
                            )
                        )
                    );
                } else {
                    // Invalid response, prompt again
                    textToSpeech(
                        'Sorry, I did not quite catch that, could you repeat?',
                        beepAudio,
                        false,
                        () => { context.current_response = ''; endSpeak(context); }
                    );
                }
            },
            
            // Repeat the question and reset current_response
            repeat: ({ context }) => {
                context.current_response = '';
                startSpeak(context);
                textToSpeech(
                    q_map[context.current_state],
                    beepAudio,
                    false,
                    () => endSpeak(context)
                );
            },

            // Cleanup dynamic values
            submitAndCleanup: ({ context }) => {
                context.form[state_map[context.current_state]] = context.current_response;
                context.current_response = '';
                context.bot_response = '';
                context.answered = false;
            },
        },

        guards: {
            // Check if the provided response is valid
            confirmResponse: ({ context, event }) => {
                startSpeak(context);
                if (event.response.toUpperCase() === 'YES') {
                    const state = context.current_state;

                    if (!validators[state](context.current_response)) {
                        textToSpeech(
                            'The information provided is not valid, please re-submit your response',
                            beepAudio,
                            false,
                            () => { context.current_response = ''; endSpeak(context); }
                        );
                        return false; // Validation failed
                    }
                    return true; // Validation successful
                }

                // Reset response if confirmation is "NO"
                context.current_response = '';
                context.answered = false;
                endSpeak(context);
                return false;
            },
        },
        states : states,
    });
};

/// Encountered problems using a dynamic state generation
export const create_voice_form_field = (target) => {
    return {
        entry: ['askQuestion'],
        on: {
            RESET: { actions: ['repeat'] },
            ANSWER: { actions: ['answer'] },
            CONFIRM: [
                {
                    guard: 'confirmResponse',
                    target: target,
                },
            ],
        },
        exit: { actions: ['submitAndCleanup'] },
    };
};