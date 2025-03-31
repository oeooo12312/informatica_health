import express from "express";
import { pushMessage, listenSub } from "../services/appointments.js";
import { getNextAppointmentRequest } from "../redis.js";
import { createPaymentLink } from "../services/stripe.js";
import { sendEmail, createGoogleMeet } from "../services/email.js";
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

  const subject = 'Your Consultation Appointment is Scheduled';
  const html =  `<p>Your consultation meeting has been scheduled. You can join using this link: <a href="${meetingLink}">Join Meeting</a>.</p>`;  // html body
  
  try {
    console.log(`email = ${email}`);
    await sendEmail(email , subject, html);
    res.status(200).send('Email sent successfully!');
  } catch (err) {
    console.error('Error sending emails');
    res.status(500).send('Error');
  }
  
})

router.post("/create-payment-link", async (req, res) => {
  try {
    const { line_items, customerEmail } = req.body;

    if (!line_items || line_items.length === 0) {
      return res.status(400).json({ error: "Invalid line items." });
    }

    const paymentLink = await createPaymentLink(line_items, customerEmail);
    const subject = 'Payment for Consultation';
    const html =  `<p> Please make your payment here. You can pay using this link: <a href="${paymentLink}">Pay Here</a>.</p>`;  // html body

    await sendEmail(customerEmail, subject, html);

    res.json({ url: paymentLink.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

// 📌 FIXED ROUTE
router.get("/create-meeting-link", async (req, res) => {
  try {
    const { scheduledTime } = req.query; // Get scheduledTime from query string

    console.log(scheduledTime);
    if (!scheduledTime) {
      return res.status(400).json({ error: "scheduledTime is required!" });
    }

    const meetingLink = await createGoogleMeet(scheduledTime);

    if (!meetingLink) {
      return res.status(500).json({ error: "Failed to create Google Meet link" });
    }

    res.json({ meetLink: meetingLink });
  } catch (error) {
    console.error("Meeting Link Error:", error);
    res.status(500).json({ error: "Server error while creating meeting link" });
  }
});

export default router;