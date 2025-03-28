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
    response_by_characters,
}) => {
    const { startSpeak, endSpeak } = createSpeechHelpers();

    return setup({
        // actions possible for the form
        actions: {
            // Ask the current question
            askQuestion: ({ context }) => {
                context.current_state += 1;
                startSpeak(context);
                console.log(q_map);
                console.log(context.current_state);

                console.log(q_map[context.current_state]);
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
                console.log('Cleaning up');
                context.form[state_map[context.current_state]] = context.current_response;
                context.current_response = '';
                context.bot_response = '';
                endSpeak(context);
                context.answered = false;
            },
        },

        guards: {
            // Check if the provided response is valid
            confirmResponse: ({ context, event }) => {
                startSpeak(context);
                console.log(event.response);
                if (event.response.toUpperCase() === 'YES') {
                    const state = context.current_state;

                    if (validators[state](context.current_response)) {
                        textToSpeech(
                            'Thank you for your confirmation. Please proceed to the next question.',
                            null,
                            false,
                            () => { context.current_response = ''; context.answered = false; endSpeak(context); }
                        );
                        return true; // Validation successful
                    }
                }

                textToSpeech(
                    'The information provided is not valid, please re-submit your response',
                    beepAudio,
                    false,
                    () => { context.current_response = ''; context.answered = false; endSpeak(context); }
                );

                // Reset response if confirmation is "NO"
                context.current_response = '';
                context.answered = false;
                endSpeak(context);
                return false;
            },
        },
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