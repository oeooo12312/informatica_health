import { 
    LOGIN_Q_MAP, 
    LOGIN_VALIDATORS, 
    LOGIN_STATE_MAP, 
    LOGIN_RESPONSE_BY_CHARACTER,
    SIGN_UP_Q_MAP,
    SIGN_UP_STATE_MAP,
    SIGN_UP_VALIDATORS,
    SIGN_UP_RESPONSE_BY_CHARACTER
} from './constants';
import { createVoiceFormSetup, create_voice_form_field } from '../../../utils/voiceFormSetup'

export const signUpVoiceForm = createVoiceFormSetup({
    q_map : SIGN_UP_Q_MAP,
    validators : SIGN_UP_VALIDATORS,
    state_map : SIGN_UP_STATE_MAP,
    response_by_characters : SIGN_UP_RESPONSE_BY_CHARACTER
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGlgEsoMBXAB3xHKyIBdCsMqAPRAWgDZ0BPDz5GhBESFAHRgMEKjXqNmSEGwQAWAEy9EADgCMYlQE4jBtQHYVAVgDMV3RcGCgA */
    id : 'signup',
    initial : 'ask_email_prefix',
    context: {
        form: {},
        current_state : -1, // increment 
        current_response: '',
        bot_response: '',
        is_speaking: false,
        answered : false,
    },
    states : {
        ask_email_prefix : {
            entry: ['askQuestion'],
            on: {
                RESET: { actions: ['repeat'] },
                ANSWER: { actions: ['answer'] },
                CONFIRM: [
                    {
                        guard: 'confirmResponse',
                        target: 'ask_email_domain',
                    },
                ],
            },
            exit: ['submitAndCleanup'],
        },
        ask_email_domain :{
            entry: ['askQuestion'],
            on: {
                RESET: { actions: ['repeat'] },
                ANSWER: { actions: ['answer'] },
                CONFIRM: [
                    {
                        guard: 'confirmResponse',
                        target: 'ask_name',
                    },
                ],
            },
            exit: ['submitAndCleanup'],
        },
        ask_name: {
            entry: ['askQuestion'],
            on: {
                RESET: { actions: ['repeat'] },
                ANSWER: { actions: ['answer'] },
                CONFIRM: [
                    {
                        guard: 'confirmResponse',
                        target: 'ask_age',
                    },
                ],
            },
            exit: ['submitAndCleanup'],
        },
        ask_age: {
            entry: ['askQuestion'],
            on: {
                RESET: { actions: ['repeat'] },
                ANSWER: { actions: ['answer'] },
                CONFIRM: [
                    {
                        guard: 'confirmResponse',
                        target: 'ask_password',
                    },
                ],
            },
            exit: ['submitAndCleanup'],
        },
        ask_password : {
            entry: ['askQuestion'],
            on: {
                RESET: { actions: ['repeat'] },
                ANSWER: { actions: ['answer'] },
                CONFIRM: [
                    {
                        guard: 'confirmResponse',
                        target: 'end',
                    },
                ],
            },
            exit: ['submitAndCleanup'],
        },
        end : {
            type : 'final',
        }
    }
})

export const loginVoiceForm = createVoiceFormSetup({
    q_map : LOGIN_Q_MAP,
    validators : LOGIN_VALIDATORS,
    state_map : LOGIN_STATE_MAP,
    response_by_characters : LOGIN_RESPONSE_BY_CHARACTER
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QBsD2UCWA7AdAQ1gGsB9MAWzw2WIAcAnMAMwwA8BiAJQFEBlLgFQDaABgC6iUDVSwMAFwyosEkC0TCANCACeagL67NaTLgIlylavSas2AQQByPAOpcOI8UhBSZ8xctUIGtp6BiBG2PhEpBRUtAzM7ADCAPL2AGIAkhwAsu7K3nIKSp4BQTqB+oboEabRFsQQqDFYnLwCeZ4FvsWgpZrlwpVh1SZR5rGNzXaOLm5i+dKFfiVq-SFVxpFmMdSTlC0p6Vm5852L3f6IAEwArADMOMIAHABsACxXLy8A7ACcb8IrgBGb5rBA3K5PHA3N43YQwm7fYTfK5vX5DcKjEg0AiwADuqDoEFafCEp0k5yKl0CYMGoUxW1ouIJROmzlcHQpPipKxpwQq9JGjJxsHxhOJh0yOU5Xkpy16iDuv2EOF+NxeQK+wiBbyeVzuTzBmt+0J+mp+byBwjuN1e+lCWFQEDgykxC258pUiAAtEC-Tg0dbIb9lZq-Tcwd7flCnk8Ici3ga1ZaMULauNLPFWO6lj0vQhvS8HoG7sHQxqdWC3h9Hr9vi94b87t8dd966nNumdg0mvscxdeVdrdCbjc69XLdagbGq-WcEW3i8QxO-rcbh2alERWKif2eQqELCHndtTbNbbITCqzXhHWG2Pm62nhvcGAsBA956AtWHnqPk87k1YQpyBSN-QNeNfheADLQNXV7V0IA */
    id : 'login',
    initial : 'ask_email_prefix',
    context: {
        form: {},
        current_state : -1, // increment 
        current_response: '',
        bot_response: '',
        is_speaking: false,
        answered : false,
    },
    states : {
        ask_email_prefix : {
            entry: ['askQuestion'],
            on: {
                RESET: { actions: ['repeat'] },
                ANSWER: { actions: ['answer'] },
                CONFIRM: [
                    {
                        guard: 'confirmResponse',
                        target: 'ask_email_domain',
                    },
                ],
            },
            exit: ['submitAndCleanup'],
        },
        ask_email_domain : {
            entry: ['askQuestion'],
            on: {
                RESET: { actions: ['repeat'] },
                ANSWER: { actions: ['answer'] },
                CONFIRM: [
                    {
                        guard: 'confirmResponse',
                        target: 'ask_password',
                    },
                ],
            },
            exit: ['submitAndCleanup'],
        },
        ask_password : {
            entry: ['askQuestion'],
            on: {
                RESET: { actions: ['repeat'] },
                ANSWER: { actions: ['answer'] },
                CONFIRM: [
                    {
                        guard: 'confirmResponse',
                        target: 'end',
                    },
                ],
            },
            exit: ['submitAndCleanup'],
        },
        end : {
            type: 'final',
        }
    }
})


// export const authenticationMachine = createMachine(
//     {
//         /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFmAduglgMbIED2OAdLOsgE7oDEAIgPICqAQgDICiA+gBUAggAUA2gAYAuolAAHUrHxkcskAA9EEgDQgAnloC+h3Wiy4CxFVRr0GAgEoBJEb0GjJMpCAVKVazQQARgAOIIoJCQBmABYogHYATniAJkSoiQBWADZdAwQMzIoUlJigmJDMlKyJMuNTDGw8IhJ8cgoAG1IofBwGCHIwCl6AN1IAayGunpxPNV9lNtVvQIBaIIyKJJD4yOioxMiU+LzEHKiKRJjd+MzDxJ2QxPqQMybLVvalKBw2OX7BsMcGNJlR8D8-nNvAt-CtEKsUhQghsoiE0pUkuigqcENlMjEKHdyolEikNvEgsdjCYQDhSBA4Go3hYWrD5IpFuQAvCgvEQlsHrtIlEDkcTvp4TtCXsJGleSEYhUYi9mc0rEsbHR0PMOWyNIgYmSKGUUtlFdkRVFjplMjjSoiYllMjsJGayTFMlEVY0Wer2tNejq-EtuQgdBKCvECTESST4hbnQkzd7zGrPpRvr85EHOctQIFw-kbUVYySNpkNh7njTVR9rAMcGAc3q1kVXVdIg8FWlDSkcU9wkFnZldqTsmjUtTDEA */
//         id : 'authentication',
//         initial : 'start',
//         context : {
//         },
//         states : {
//             start : {
//                 on : {
//                     'DOUBLE_TAP' : {
//                         target : 'login'
//                     },
//                     'TRIPLE_TAP' : {
//                         target : 'signUp'
//                     }
//                 }
//             },
//             login : {
//                 invoke : {
//                     id: 'login',
//                     src: loginVoiceForm,
//                     onDone: {
//                         target: 'done',
//                         actions: () => console.log('Login Form done')
//                     }
//                 }
//             },
//             signUp : {
//                 invoke : {
//                     id : 'signUp',
//                     src : signUpVoiceForm,
//                     onDone : {
//                         target : 'done',
//                         actions: () => console.log('Signup Form done')
//                     }
//                 }
//             },

//             done : {
//                 type : 'final'
//             }
//     }
// })