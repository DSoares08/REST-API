import { boolean } from "drizzle-orm/mysql-core";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const customers = pgTable('customers', {
  stripeCustomerId: serial('stripeCustomerId').primaryKey(),
});

export const customersRelations = relations(customers, ({ one }) => ({
  apiKeys: one(apiKeys, { fields: [customers.stripeCustomerId], references: [apiKeys.apiKey] }),
  stripeCustomerId: one(stripeCustomerId, { fields: [customers.stripeCustomerId], references: [stripeCustomerId.apiKey, stripeCustomerId.active, stripeCustomerId.itemId, stripeCustomerId.calls] })
}));

export const apiKeys = pgTable('apiKeys', {
  apiKey: varchar('apiKey', { length: 256 }).primaryKey(),
});

export const stripeCustomerId = pgTable('stripeCustomerId', {
  apiKey: varchar('apiKey', { length: 256 }).primaryKey(),
  active: boolean('active'),
  itemId: varchar('itemId', { length: 256 }),
  calls: number('calls'),
});
