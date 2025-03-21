
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
import { createVoiceFormSetup, create_voice_form_field } from '../../../utils/voiceFormSetup';


export const authenticationMachine = createVoiceFormSetup({
    q_map : LOGIN_Q_MAP,
    validators : LOGIN_VALIDATORS,

})

export const signUpVoiceForm = createVoiceFormSetup({
    q_map : SIGN_UP_Q_MAP,
    validators : SIGN_UP_VALIDATORS,
    state_map : SIGN_UP_STATE_MAP,
    respose_by_characters : SIGN_UP_RESPONSE_BY_CHARACTER
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGlgEsoMBXAB3xHKyIBdCsMqAPRAWgDZ0BPDz5GhBESFAHRgMEKjXqNmSEGwQAWAEy9EADgCMYlQE4jBtQHYVAVgDMV3RcGCgA */
    id : 'signup',
    initial : 'ask_email_prefix',
    states : {
        ask_email_prefix : create_voice_form_field('ask_email_domain'),
        ask_email_domain : create_voice_form_field('ask_name'),
        ask_name: create_voice_form_field('ask_age'),
        ask_age: create_voice_form_field('ask_password'),
        ask_password : create_voice_form_field('end'),
        end : {
            type : 'final',
        }
    }
})

export const loginVoiceForm = createVoiceFormSetup({
    q_map : LOGIN_Q_MAP,
    validators : LOGIN_VALIDATORS,
    state_map : LOGIN_STATE_MAP,
    respose_by_characters : LOGIN_RESPONSE_BY_CHARACTER
}).createMachine({
    id : 'login',
    initial : 'ask_email_prefix',
    states : {
        ask_email_prefix : create_voice_form_field('ask_email_domain'),
        ask_email_domain : create_voice_form_field('ask_password'),
        ask_password : create_voice_form_field('end'),
        end : {
            type: 'final',
        }
    }
})