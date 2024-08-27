import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

import usersRoutes from './routes/users.js';
import checkoutRoute from './routes/checkout.js';
import webhookRoute from './routes/webhook.js';
import { randomBytes, createHash } from 'crypto';
import { apiKeys } from './schema'


// Recursive function to generate a unique random string as API key
export function generateAPIKey() {
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
export function hashAPIKey(apiKey) {
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
