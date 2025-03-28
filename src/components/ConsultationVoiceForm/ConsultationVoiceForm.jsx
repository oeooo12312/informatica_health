// components/ConsultationMachine/ConsultationMachine.jsx
import React, { useEffect, useState, useRef } from 'react';
import { consultationVoiceFormConfig } from './consultationVoiceFormConfig';
import VoiceForm from '../VoiceForm/VoiceForm';
import './ConsultationVoiceForm.css';
import { useUserContext } from '../../context/UserContext';
import { doc , setDoc } from 'firebase/firestore';
import { db } from '../../firebase';


const sendFormToPubSub= async (form) => {
    // send the initial form data to pub/sub.
}

const createFormData = async (finalized_form) => {
    // send the final form data into cloud firestore inside a nested collection of 'forms/{date}'
    // try {
    //     // await setDoc(doc(db, `forms/${}`, ))
    // }
}

function ConsultationVoiceForm() {
    


    const { user, fetchUserData } = useUserContext();
    const onSubmit = (form) => {
        // do something here i guess.
        const userData = fetchUserData(user);

    }
    
    return (
        <VoiceForm voiceForm={consultationVoiceFormConfig} onSubmit={onSubmit}></VoiceForm>
    );
}

export default ConsultationVoiceForm;