// components/ConsultationMachine/ConsultationMachine.jsx
import React, { useEffect, useState, useRef } from 'react';
import { consultationVoiceFormConfig } from './consultationVoiceFormConfig';
import VoiceForm from '../VoiceForm/VoiceForm';
import './ConsultationVoiceForm.css';

function ConsultationVoiceForm() {
    
    const onSubmit = () => {
        // do something here i guess.
    }
    
    return (
        <VoiceForm voiceForm={consultationVoiceFormConfig}></VoiceForm>
    );
}

export default ConsultationVoiceForm;