import React, { useState, useEffect } from 'react';
import { useAppointmentContext } from '../../context/AppointmentContext';
import './Consultation.css';

const CONSULTATION_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

function Consultation() {
  const { getCurrentAppointment } = useAppointmentContext();
  const [appointment, setAppointment] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(CONSULTATION_TIME); // Start with full consultation time
  const [prescriptions, setPrescriptions] = useState([]); // List of meds from Stripe
  const [selectedPrescription, setSelectedPrescription] = useState('');
  const [dosage, setDosage] = useState('');

  useEffect(() => {
    // Fetch prescriptions from Stripe Product Catalog
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch('/api/stripe/products'); // Replace with actual API endpoint
        const data = await response.json();
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, []);

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (!selectedPrescription || !dosage) {
      alert('Please select a prescription and enter dosage instructions.');
      return;
    }

    // Handle submission (e.g., send data to backend)
    alert(`Prescription: ${selectedPrescription}, Dosage: ${dosage}`);
    
    // Reset form
    setSelectedPrescription('');
    setDosage('');
  };

  const getNextAppointment = () => {
    if (appointment) {
      const updatedAppointment = { ...appointment, status: 'completed' };
      localStorage.setItem('completedAppointment', JSON.stringify(updatedAppointment));
      alert('Appointment saved to local storage!');
    }
    const nextAppointment = getCurrentAppointment();
    setAppointment(nextAppointment);
    setStartTime(nextAppointment ? Date.now() : null);
    setTimeLeft(CONSULTATION_TIME); // Reset timer when a new appointment starts
  };

  useEffect(() => {
    if (!appointment) {
      getNextAppointment();
    } else {
      const timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remainingTime = CONSULTATION_TIME - elapsed;
        setTimeLeft(remainingTime);

        // When the time is up, alert and move to the next appointment
        if (remainingTime <= 0) {
          alert('Consultation time is up! Ending appointment.');
          getNextAppointment();
        }
      }, 1000); // Update every second

      return () => clearInterval(timerInterval); // Cleanup on component unmount
    }
  }, [appointment, startTime]);

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

            {/* Replace iframe with an actual embedded video API */}
            <iframe
              src={appointment.meetingLink}
              width="600"
              height="400"
              allow="camera; microphone; fullscreen;"
              title="Consultation Video"
            ></iframe>
            <button onClick={getNextAppointment}>End Consultation</button>
          </div>
        ) : (
          <p>No appointment, rest brother 😎</p>
        )}
      </div>

      {appointment && (
        <div className="sidebar">
          <h3>Consultation Form</h3>
          <form onSubmit={handlePrescriptionSubmit}>
            <label>Patient Name</label>
            <input type="text" name="patientName" defaultValue={appointment.patientName} readOnly />

            <label>Consultation Notes</label>
            <textarea name="notes"></textarea>
            <button type="submit">Save Notes</button>

            {/* Prescription Form */}
            <label htmlFor="prescription">Prescription</label>
            <select
              id="prescription"
              value={selectedPrescription}
              onChange={(e) => setSelectedPrescription(e.target.value)}
            >
              <option value="">Select a prescription</option>
              {prescriptions.map((med) => (
                <option key={med.id} value={med.name}>
                  {med.name} - ${med.price / 100}
                </option>
              ))}
            </select>

            <label htmlFor="dosage">Dosage Instructions</label>
            <input
              type="text"
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., Take 1 tablet daily"
            />

            <button type="submit">Prescribe</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Consultation;