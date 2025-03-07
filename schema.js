import { pgTable, text, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Table 1: Customers
export const customers = pgTable('customers', {
  stripeCustomerId: text('stripe_customer_id').primaryKey(),
  apiKey: text('api_key').notNull(),
  active: boolean('active').default(false),
  itemId: text('item_id'),
});

// Table 2: API Keys (Reverse mapping from apiKey to stripeCustomerId)
export const apiKeys = pgTable('api_keys', {
  apiKey: text('api_key').primaryKey(),
  stripeCustomerId: text('stripe_customer_id')
    .notNull()
    // Define foreign key directly in the column definition
    .references(() => customers.stripeCustomerId),
});

// Defining relations between tables
export const apiKeyRelations = relations(apiKeys, ({ one }) => ({
  customer: one(customers, {
    fields: [apiKeys.stripeCustomerId],
    references: [customers.stripeCustomerId],
  }),
}));

