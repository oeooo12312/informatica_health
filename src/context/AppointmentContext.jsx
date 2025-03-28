import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDocs, setDoc, doc, collection } from 'firebase/firestore';
import { db } from '../firebase';  // Adjust this import if needed

// Create a context
const AppointmentContext = createContext();

// Provide context value
export const AppointmentProvider = ({ children }) => {
  // Initialize state from localStorage or an empty array if nothing is in localStorage
    // Main method: Fetch the current appointment
    const getCurrentAppointment = async () => {
        try {
            // Just check from firestore. 
            console.log(import.meta.env.VITE_MACHINE_ID);
            const currentAppointment = await fetchAppointmentFromFirestore(import.meta.env.VITE_MACHINE_ID);
            console.log(currentAppointment);

            // 1. Get the current time and add 10 minutes
            const currentTime = new Date();
            const scheduledTime = new Date(currentTime.getTime() + 10 * 60000); // Add 10 minutes (60000 ms = 1 minute)
    
            // 2. Format scheduled time for your system (ISO String or Unix Timestamp)
            const scheduledTimeString = scheduledTime.toISOString(); // You can use .getTime() if you prefer Unix timestamp
    
            // 3. Generate a meeting link (assuming a placeholder meeting link format here)
            const meetingLink = `https://your-meeting-platform.com/meeting/${scheduledTimeString}`;
    
            // 4. Notify user
            console.log("Scheduled Time for Meeting:", scheduledTimeString);
            console.log("Generated Meeting Link:", meetingLink);
    
            // Notify the user, or perhaps update your UI
            // e.g., alert("Your meeting is scheduled. Join using this link: " + meetingLink);
            fetch('http://localhost:5000/api/appointments/send-appointment-email', {
                method: 'POST',  // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json',  // Set the content type to JSON
                },
                body: JSON.stringify({
                    email: currentAppointment.email,  // Pass the appointment email
                    meetingLink: meetingLink   // Pass the meeting link
                })
                })
                .then(data => {
                    console.log('Email sent successfully:', data);
                })
                .catch(error => {
                    console.error('Error sending email:', error);
            });
    
            // Optionally, save this info in Firestore or another state
            // You might want to add a field like meetingLink to the currentAppointment
            currentAppointment.meetingLink = meetingLink;
    
            console.log(currentAppointment);
            return currentAppointment;
        } catch (error) {
            console.error("Error fetching the current appointment:", error);
            return null;
        }
    };
  
    // Fetch appointments from Redis via API to Firestore temp bucket
    // This should be done externally in another node.js file, probably at intervals of 30s.
     // Then 
    const fetchNextAppointmentFromRedis = async (machineId) => {
        try {
        const response = await fetch(`http://localhost:5000/api/appointments/get`);
        const data = await response.json();
    
        if (data.appointment) {
            const appointment = data.appointment; // Get the highest priority
            // Backup to Firestore under machine-specific subcollection
            await setDoc(doc(collection(db, `machines/${machineId}/pendingAppointments/`), appointment.uid), appointment);
            return appointment; // Return the fetched appointment immediately
        }
    
        return null; // No appointment available from Redis
        } catch (error) {
        console.error('Error fetching appointments from Redis:', error);
        return null;
        }
    };
  
    // Fetch the latest appointment for a specific machine
    const fetchAppointmentFromFirestore = async (machineId) => {
        try {
        const machineCollection = collection(db, `machines/${machineId}/pendingAppointments/`);
        const snapshot = await getDocs(machineCollection);
    
        let appointments = snapshot.docs.map((doc) => doc.data());
    
        // If no appointments exist, fetch from Redis and store it
        if (appointments.length === 0) {
            const redisAppointment = await fetchNextAppointmentFromRedis(machineId);
            return redisAppointment || null; // Return from Redis if available, else null
        }
    
        // Sort the residual documents in firestore by severity and timestamp
        appointments.sort((a, b) => {
            if (b.severity_score !== a.severity_score) {
            return b.severity_score - a.severity_score; // Higher severity first
            }
            return new Date(a.timestamp) - new Date(b.timestamp); // Earlier time first
        });
    
        return appointments[0]; // Return the top-priority appointment
        } catch (error) {
        console.error('Error fetching appointments from Firestore for machine:', machineId, error);
        return null;
        }
    };
    
    // Mark an appointment as completed and move it to the completed collection
    const completeAppointment = async (machineId, appointment) => {
        try {
        const tempDocRef = doc(db, `machines/${machineId}/pendingAppointments/`, appointment.uid);
        const todayDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
        const userRef = collection(db, `machines/${machineId}/completedAppointments/${todayDate}`);
        const completedDocRef = doc(userRef, appointment.uid);
    
        const docSnapshot = await getDoc(tempDocRef);
    
        if (docSnapshot.exists()) {
            // Move to 'completed' under machine_id and date
            await setDoc(completedDocRef, docSnapshot.data());
            console.log(`Moved appointment with UID: ${appointment.uid} to completed.`);
    
            // Delete from 'pendingAppointments' under machine_id
            await deleteDoc(tempDocRef);
            console.log(`Deleted appointment with UID: ${appointment.uid} from temp.`);
        } else {
            console.warn(`Appointment with UID: ${appointment.uid} not found for machine: ${machineId}`);
        }
        } catch (error) {
        console.error('Error completing appointment:', error);
        }
    };

    const contextValue = {
        completeAppointment,
        getCurrentAppointment,
    };

  return <AppointmentContext.Provider value={contextValue}>{children}</AppointmentContext.Provider>;
};

// Custom hook to access appointment context
export const useAppointmentContext = () => {
  return useContext(AppointmentContext);
};