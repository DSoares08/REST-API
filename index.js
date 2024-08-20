import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

import usersRoutes from './routes/users.js';
import checkoutRoute from './routes/checkout.js';
import webhookRoute from './routes/webhook.js';

// TODO Implement a real database
// Reverse mapping of stripe to API key. Model this in your preferred database.
const customers = {
  // stripeCustomerId : data
  stripeCustomerId: {
    apiKey: '123xyz',
    active: false,
    itemId: stripeItemId,
    calls: 0,
  },
};
const apiKeys = {
  // apiKey : customerdata
  '123xyz': 'cust1',
};


// Recursive function to generate a unique random string as API key
function generateAPIKey() {
  const { randomBytes } = require('crypto');
  const apiKey = randomBytes(16).toString('hex');
  const hashedAPIKey = hashAPIKey(apiKey);

  // Ensure API key is unique
  if (apiKeys[hashedAPIKey]) {
    generateAPIKey();
  } else {
    return { hashedAPIKey, apiKey };
  }
}

// Compare the API key to hashed version in database
function hashAPIKey(apiKey) {
  const { createHash } = require('crypto');

  const hashedAPIKey = createHash('sha256').update(apiKey).digest('hex');

  return hashedAPIKey
}

const app = express();
const PORT = 5000;

app.use(express.raw({ type: 'application/json' }));

app.use(bodyParser.json());

app.use('/users', usersRoutes);

app.use('/checkout', checkoutRoute);

app.use('/webhook', webhookRoute);

app.get('/', (req, res) => res.send('Hello from Homepage.'));

app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`));
