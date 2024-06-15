import stripe from 'stripe';

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
      console.log(data);
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
