import { Redis } from "ioredis";

// Initialize Redis client
const redis = new Redis({
  host: 'localhost',  // or your Redis server host
  port: 6379,         // Redis port
  password: '' // if you have one
});

// Helper to calculate composite score
const calculatePriorityScore = (appointment, availableTime = 0) => {
    const { scheduledTime, severity, creationTime } = appointment;
  
    const isUnscheduled = !scheduledTime;
    const currentTime = new Date().getTime(); // Get the current time
  
    // For unscheduled appointments, use a higher priority if availableTime is sufficient
    let scheduledTimeMs = isUnscheduled
        ? currentTime + availableTime // prioritize unscheduled if there’s time available
        : new Date(scheduledTime).getTime();
    
    const creationTimeMs = new Date(creationTime).getTime();

    // Prioritize severity (higher is better) and give priority to appointments that are soon
    if (!isUnscheduled) {
        const timeUntilScheduled = scheduledTimeMs - currentTime;
        if (timeUntilScheduled <= 2 * 60 * 60 * 1000) { // If within the next 2 hours
            // Prioritize scheduled appointments closer in time by factoring it into the score
            scheduledTimeMs = currentTime; // Lower the value to prioritize closer appointments
        }
    }

    // Adjust priority based on severity and time
    return (scheduledTimeMs - severity * 1e9) + (creationTimeMs * 1e-6);
};
  
  // Add appointment with new priority logic
export const addAppointmentRequest = async (appointment) => {
    try {
      const priorityScore = calculatePriorityScore(appointment);
      const appointmentData = JSON.stringify(appointment);
  
      // Add to Redis sorted set
      await redis.zadd('appointment_requests', priorityScore, appointmentData);
  
      console.log('Appointment request added successfully');
    } catch (err) {
      console.error('Error adding appointment request:', err);
    }
};

export const getNextAppointmentRequestBatch = async (start = 0, count = 1) => {
    try {
      const appointments = await redis.zrevrange('appointment_requests', start, start + count - 1);
  
      const appointmentData = [];
  
      if (appointments.length > 0) {
        for (const appointment of appointments) {
          const appointmentObject = JSON.parse(appointment);
          appointmentData.push(appointmentObject);
  
          // Optionally, remove appointment after processing (if you want to simulate "consuming" it)
          await redis.zrem('appointment_requests', appointment);
        }
      } else {
        console.log('No pending appointment requests.');
      }
  
      return appointmentData;
    } catch (err) {
      console.error('Error fetching appointment requests:', err);
      throw err;
    }
};

// Fetch the next appointment from Redis (returns only the top appointment)
export const getNextAppointmentRequest = async () => {
    try {
      // Fetch the highest-priority appointment (O(1) operation with sorted sets)
      const appointment = await redis.zrevrange('appointment_requests', 0, 0);
  
      if (appointment.length > 0) {
        const appointmentObject = JSON.parse(appointment[0]);
  
        // Optionally, remove the appointment after processing
        await redis.zrem('appointment_requests', appointment[0]);
  
        return appointmentObject;
      } else {
        console.log('No pending appointment requests.');
        return null;
      }
    } catch (err) {
      console.error('Error fetching the next appointment request:', err);
      throw err;
    }
  };
  