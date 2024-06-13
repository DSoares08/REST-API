import stripe from 'stripe';

const stripeInstance = stripe('sk_test_51M1dZpBAV94IwLh6qKxJzNwwvbSDaPKxzqP8Kj9weNGMCRuj1y0S0giQWVeMJGJ9hZo71y7NWaTqJU8GPlRrMpI200fFWrWKQg');

// Create a Stripe Checkout Session to create a customer and subscribe
export const checkout = async (req, res) => {
    const session = await stripeInstance.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: 'price_1PEukHBAV94IwLh6Wlo4bQmK'
      },
    ],
    success_url:
      'http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:5000/error',
  });

  res.send(session);
}
