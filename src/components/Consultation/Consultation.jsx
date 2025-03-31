import React, { useState, useEffect, useRef } from 'react';
import { useAppointmentContext } from '../../context/AppointmentContext';
import PrescriptionForm from '../PrescriptionForm/PrescriptionForm';
import JitsiVideoCall from '../JitsiVideoCall/JitsiVideoCall';
import './Consultation.css';

const CONSULTATION_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

function Consultation() {
  const { getCurrentAppointment } = useAppointmentContext();
  const [appointment, setAppointment] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(CONSULTATION_TIME); // Start with full consultation time
  const appointmentHandled = useRef(false);

  const getNextAppointment = async () => {
    if (appointment) {
      const updatedAppointment = { ...appointment, status: 'completed' };
      localStorage.setItem('completedAppointment', JSON.stringify(updatedAppointment));
      alert('Appointment saved to local storage!');
    }

    const nextAppointment = await getCurrentAppointment();
    setAppointment(nextAppointment);
    setStartTime(nextAppointment ? Date.now() : null);
    setTimeLeft(CONSULTATION_TIME); // Reset timer when a new appointment starts
  };

  useEffect(() => {
    // Only call getNextAppointment once when appointment is not set
    if (!appointment && !appointmentHandled.current) {
      appointmentHandled.current = true; // Mark that appointment has been handled
      getNextAppointment();
    }
    else {
      const timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remainingTime = CONSULTATION_TIME - elapsed;
        setTimeLeft(remainingTime);

        if (remainingTime <= 0 && !hasAppointmentEnded.current) {
          alert('Consultation time is up! Ending appointment.');
          getNextAppointment();
          appointmentHandled.current = true; // Mark that appointment has been handled
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [appointment, startTime]); // Only track changes to `appointment`


  // Function to format the time left (hh:mm:ss)
  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="consultation-container">
      <div className="video-call">
        {appointment ? (
          <div className='video-container'>
            <h2>Consultation Video Call</h2>
            {/* Display the timer */}
            <div className="timer">
              <h3>Time Left: {formatTime(timeLeft)}</h3>
            </div>
            <JitsiVideoCall roomName={appointment.roomName}></JitsiVideoCall>
            <button onClick={getNextAppointment}>End Consultation</button>
          </div>
        ) : (
          <p>No appointment, rest brother 😎</p>
        )}
      </div>

      {appointment && (
        <div className="sidebar">
          <PrescriptionForm appointment={appointment}></PrescriptionForm>
        </div>
      )}
    </div>
  );
}

export default Consultation;