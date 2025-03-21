// components/ConsultationMachine/consultationMachine.js
import { createVoiceFormSetup, create_voice_form_field } from '../../utils/voiceFormSetup';
import isEqual from 'lodash.isequal';

export const BEEP_PROMPT = 'Press and hold to start recording after the beep.';

export const Q_MAP = [

    `What symptoms are you experiencing? ${BEEP_PROMPT}`,
];

export const VALIDATORS = [
    (name) => {
        console.log(name); return name.length > 5;},
    (age) =>  {return age > 18;},
]

export const STATE_MAP = {
    0 : 'name',
    1 : 'age',
    2 : 'symptoms',
}

export const RESPONSE_BY_CHARACTERS = [
    true,
    true,
    true,
    false,
]
const consultationStates = {
    ask_symptoms: create_voice_form_field('end'),
    end: {
      type: 'final',
    },
  };

// This is a state machine for the robot for consultation.
// The below represents all the actions and states of the consultation robot.
// Ok put it simply : 
// Entry : OnStateEnter (Unity) : Fired once everytime we enter this state.
// On : OnStateUpdate (Unity) : Every event here are fired everytime it is being called in this state.
// Exit : OnStateExit (Unity) : Every event here are fired once we transition out of this state.
// Use guard only if you want to transition between states.
export const consultationVoiceFormConfig = createVoiceFormSetup({
    q_map : Q_MAP,
    validators : VALIDATORS,
    state_map : STATE_MAP,
    states : consultationStates,
    response_by_characters : RESPONSE_BY_CHARACTERS
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGMD2A7WBXANgFwEM8BLDAOgNgGsB9dAgWzAGIAlAUQGV2AVAbQAMAXUSgADqljESGUSAAeiALQBGAEwBWMgA41AThXaAbHqMa9AdiMBmawBoQAT0QqVWm9oFGjF6wBZrE18AX2CHNExcQhl0Cmo6RhYAQQA5TgB1dlZBESQQCSkYuUUEVWsVMgFtawE9AQsNDRUjNWqHZwR9NTJrDTU-Pxa-FSrtFVDwjGx8IlJYylp6JmYAYQB5FIAxAElWAFkcuQLpOeLlZp0VAKa6qoFRi3bEa20LMiaBQJU9DXKVCz0ExAEWm0TmcVoBBgbC4vEOeWORTyJVUmh0+kMJjMlhsTwQGm8PQstTG1gsg38GiBIKis3ICxoUOSaUy2WER0kJ1kyPOam6flemga1Vaum0eKs1neZkaKlsIwGampU1pMQhjOh6y2uwO7IRnKRoBKmncjT8XjJOIErQl1rIRm0ejU3z0ph+rmVkRmaoZsEcDDEeFQDFgMO4-D14gNpx5CGG2nePzUFmdal6IzURjxBKMRJJcvJNgGntBdPm8T9AaDIeYqQyWXhUcKMaNiGGUv8cplfg0Xm+9iciEl0saTXlAkVJdV4N9-sDwdDWp2+0b+Wj3Nb+JTiZqXkdvetWcHCBebw+Lz8mZT6iMoTCIHQqAgcDkNO9LbXzY3CnOAMq1VqepZRaNpj1aMg5U8clrW0PwrDgvwp3fel4iWMAOS-dAzjjR5j0MbofnKHsjE+AQridJCwRQyEYAwrksNjMwdE8fobE0QI0w0PEzFzF5HXUDQBQBKxKLLMgwHQCA6MNH8ECMHt-wMdQrDHcU8PJMhhjcQJXhaQxEPvN8qPLWhK3nENpI-EobA7DRrzg10yX0biCR6bR+M0ITLAsO9giAA */
    id: 'consultation',
    initial: 'ask_symptoms',
    states : consultationStates,
});
