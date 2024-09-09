import stripe from 'stripe';
import { generateAPIKey } from '../index.js';
import { customers, apiKeys } from '../schema.js'
import { db } from '../db.js';

const stripeInstance = stripe(process.env.SECRET_KEY)

// Listen to webhooks from Stripe when important events happen
export const webhook = async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers['stripe-signature'];

    try {
      event = stripeInstance.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case 'checkout.session.completed':
      // Data included in the event object:
      const customerId = data.object.customer;
      const subscriptionId = data.object.subscription;

      console.log(`💰 Customer ${customerId} subscribed to plan ${subscriptionId}`);

      // Get the subscription. The first item is the plan the user subscribed to.
      const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId);
      const itemId = subscription.items.data[0].id;

      // Generate API key
      const { apiKey, hashedAPIKey } = generateAPIKey();
      console.log(`Generated unique API key: ${apiKey}`);

      // Store the API key in your database.
      await db.insert(customers).values({
        stripeCustomerId: customerId,
        apiKey: hashedAPIKey,
        active: true,
      })
      await db.insert(apiKeys).values({
        apiKey: hashedAPIKey,
        stripeCustomerId: customerId,
      })
      break;
    case 'invoice.paid':
      break;
    case 'invoice.payment_failed':
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
}
