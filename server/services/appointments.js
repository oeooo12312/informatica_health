import { PubSub } from "@google-cloud/pubsub";
import { addAppointmentRequest } from '../redis.js';
// Create a cached PubSub client instance
const pubSubClient = new PubSub();

/**
 * Publishes a message to a given topic.
 * @param {string} topic - The name of the Pub/Sub topic.
 * @param {object} data - The message data to publish.
 * @returns {Promise<string>} - The message ID.
 * @throws {Error} - If publishing fails.
 */
export const pushMessage = async (topic, data) => {
  if (!topic || !data) {
    throw new Error("Topic and data are required.");
  }

  const dataBuffer = Buffer.from(JSON.stringify(data));
  const messageId = await pubSubClient.topic(topic).publishMessage({ data: dataBuffer });

  console.log(`Message ${messageId} published.`);
  return messageId; // For testing and debugging.
};

/**
 * Listens to a Pub/Sub subscription for a given time.
 * @param {string} subscription - The subscription name.
 * @param {number} timeout - Time in seconds to listen for messages.
 * @returns {Promise<number>} - Number of messages received.
 */
export const listenSub = (subscription, timeout = 30) => {
  return new Promise((resolve, reject) => {
    if (!subscription) {
      return reject(new Error("Subscription name is required."));
    }

    const subscriptionObj = pubSubClient.subscription(subscription);
    let messageCount = 0;

    const messageHandler = (message) => {
      const data = message.data.toString()
      console.log(`Received message ${message.id}: ${data}`, );
      const appointment = JSON.parse(data);
      addAppointmentRequest(appointment);
      message.ack();
      messageCount++;
    };

    subscriptionObj.on("message", messageHandler);

    setTimeout(() => {
      subscriptionObj.removeListener("message", messageHandler);
      console.log(`${messageCount} message(s) received.`);
      resolve(messageCount);
    }, timeout * 1000);
  });
};


// if there is a scheduledTime , priority must be based on time diff between scheduledTime and currentTime, then severity, then timeCreated
pushMessage('consultations',  { email:'jamespoh1999@gmail.com', uid : '12345678', name : 'jp', type : 'test', severity : 10, creationTime : null, scheduledTime : null }); // no scheduledTime for 