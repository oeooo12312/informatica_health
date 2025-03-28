import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import Consultation from '../../../components/Consultation/Consultation';
import { AppointmentProvider } from '../../../context/AppointmentContext';
import './Appointment.css';

function Appointment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedAppointments, setCompletedAppointments] = useState([
    { id: 1, patient: 'John Doe', date: '2024-03-27', status: 'Completed' },
    { id: 2, patient: 'Jane Smith', date: '2024-03-26', status: 'Completed' },
    { id: 3, patient: 'Michael Lee', date: '2024-03-25', status: 'Completed' },
  ]); // Dummy data

  const openModal = async () => {
    setIsModalOpen(true);
  };

  const endAppointment = () => {
    alert('Appointment ended and saved!');
  };

  const onClose = () => {
    endAppointment();
    setIsModalOpen(false);
  };

  const onClosePrompt = 'Are you sure you want to end the current appointment?';
  
  return (
    <AppointmentProvider>
      <div className="container">
        <h1 className="title">📋 Appointment Requests</h1>

        {/* Button aligned to the right */}
        <div className="button-container">
          <button onClick={openModal} className="open-modal-btn">
            Start Consultation
          </button>
        </div>

        {isModalOpen && (
          <Modal onClose={onClose} onClosePrompt={onClosePrompt}>
            <Consultation />
          </Modal>
        )}

        {/* Table for completed appointments */}
        <div className="appointments-table">
          <h2>Completed Appointments</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {completedAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patient}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppointmentProvider>
  );
}

export default Appointment;