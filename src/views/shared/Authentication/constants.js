const BEEP_PROMPT = 'Press and hold to start recording after the beep.';
const allowedDomains = ["GOOGLE", "MICROSOFT"];  // Add allowed domains here

export const LOGIN_Q_MAP = [
    `What is your email prefix? ${BEEP_PROMPT}`,
    `What is your email domain? Google or Microsoft? ${BEEP_PROMPT}`, // use allowed domains instead
    `What is your password? ${BEEP_PROMPT}`,
]

export const LOGIN_STATE_MAP = {
    0 : 'email_prefix',
    1 : 'email_domain',
    2 : 'password'
}

export const LOGIN_VALIDATORS = [
    (prefix) => { return prefix.length > 10;},
    (domain) => {
        console.log(domain);
        return allowedDomains.includes(domain.toUpperCase());  // Check if the domain is in the allowed list
    },
    (password) => {
        return password.length > 8;
    }
]

export const LOGIN_RESPONSE_BY_CHARACTER = [
    true,
    false,
    true,
]

export const SIGN_UP_Q_MAP = [
    `What is your email prefix? ${BEEP_PROMPT}`,
    `What is your email domain? Google or Microsoft? ${BEEP_PROMPT}`,
    `What is your name? ${BEEP_PROMPT}`,
    // `When is your date of birth? ${BEEP_PROMPT}`,
    `What is your age? ${BEEP_PROMPT}`,
    `What is your password? ${BEEP_PROMPT}`
]

export const SIGN_UP_STATE_MAP = {
    0 : 'email_prefix',
    1 : 'email_domain',
    2 : 'name',
    3 : 'age',
    4 : 'password'
}

export const SIGN_UP_VALIDATORS = [
    (prefix) => { return prefix.length > 10;},
    (domain) => {
        console.log(domain);
        return allowedDomains.includes(domain.toUpperCase());  // Check if the domain is in the allowed list
    },
    (name) => { return name.length >= 5},
    (age) => { console.log(age); return age > 18;},
    (password) => {
        return password.length > 8;
    }
]

export const SIGN_UP_RESPONSE_BY_CHARACTER = [
    true,
    false,
    true,
    false,
    true   
]