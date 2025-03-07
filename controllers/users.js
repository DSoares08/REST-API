import { v4 as uuidv4 } from 'uuid';

import stripe from 'stripe';
import { hashAPIKey } from '../index.js';
import { customers, apiKeys } from '../schema.js'
import { db } from '../db.js';
import { eq } from 'drizzle-orm';

const stripeInstance = stripe(process.env.SECRET_KEY);

let users = [];
let cachedCustomer = [];

export const getUsers = async (req, res) => {

  const apiKey = req.query.apiKey;

  if (!apiKey) {
    res.status(400); // Bad request
  }

  const hashedAPIKey = hashAPIKey(apiKey)

  const customerId = await db.select().from(apiKeys).where(eq(apiKeys.apiKey, hashedAPIKey));

  // Caches the most recent user to avoid unnecessary database queries
  let customer = users.find(user => user.apiKey === hashedAPIKey);
  if (!customer) {
    customer = await db.select().from(customers).where(eq(customers.apiKey, hashedAPIKey));
    if (customer.length > 0) {
      cachedCustomer[0] = customer[0];
    }
  }

  if (!customer[0].active) {
    res.sendStatus(403); // not authorized
  } else {

    // Record usage with Stripe Billing
    const meterEvent = await stripeInstance.billing.meterEvents.create({
      event_name: 'api_requests',
      payload: {
        value: '1',
        stripe_customer_id: customerId[0].stripeCustomerId,
      },
    });
    res.send(users);
  }

}

export const createUser = (req, res) => {
  const user = req.body;

  users.push({ ...user, id: uuidv4() });

  res.send(`User with the name ${user.firstName} added to the database!`);
}

export const getUser = (req, res) => {
  const { id } = req.params;

  const foundUser = users.find((user) => user.id === id);

  res.send(foundUser);
}

export const deleteUser = (req, res) => {
  const { id } = req.params;

  users = users.filter((user) => user.id !== id);

  res.send(`User with the id ${id} deleted from the database.`);
}

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age } = req.body;

  const user = users.find((user) => user.id === id);

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (age) user.age = age;

  res.send(`User with the id ${id} has been updated`);
}

