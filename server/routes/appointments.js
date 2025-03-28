import express from "express";
import { pushMessage, listenSub } from "../services/appointments.js";
import { getNextAppointmentRequest } from "../redis.js";
import { sendEmailAppointment } from "../services/email.js";
const router = express.Router();

// Publish Message Route
router.post("/publish", async (req, res) => {
  try {
    const { topic, data } = req.body;
    const messageId = await pushMessage(topic, data);
    res.status(200).json({ message: "Message published successfully.", messageId });
  } catch (error) {
    console.error("Error publishing message:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Listen for Messages Route
router.get("/get", async (req, res) => {
    try {
        
      // Fetch the next batch of appointment requests
      const appointment = await getNextAppointmentRequest(); // default to 1.
      console.log(appointment);
  
      // Respond with the appointment data
      res.status(200).json({
        success: true,
        appointment: appointment,
      });
    } catch (err) {
      console.error('Error fetching appointment requests:', err);
      res.status(500).json({
        success: false,
        message: 'Error fetching appointment requests',
      });
    }
  });

router.post('/send-appointment-email', async (req, res) => {
  const { email, meetingLink } = req.body;
  
  if (!email || !meetingLink) {
      return res.status(400).send('Missing email or meeting link.');
  }
  try {
    console.log(`email = ${email}`);
    await sendEmailAppointment(email , meetingLink);
    res.status(200).send('Email sent successfully!');
  } catch (err) {
    console.error('Error sending emails');
    res.status(500).send('Error');
  }
  
})

export default router;