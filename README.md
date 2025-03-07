# REST-API

## Problem

[MonAT (Monetized API Template)](https://hilarious-hummingbird-e12b5a.netlify.app/) consists of a simple REST API which serves as a template for future projects. When the user creates an account and enters their payment details, they are provided with an API key to access an endpoint. The user is then billed on a monthly basis depending on the number of requests they make to the endpoint, achieved by integrating Stripe.

## Steps

The first step was to implement POST, GET, PATCH and DELETE requests to have a full-fledged CRUD application. This was achieved with Node.js.

Secondly, I created functions to generate and hash API keys for customers.

Moving on to arguably the most important step, Stripe integration. I created a webhook to listen to whenever the user makes a request with their API key.

Finally, I implemented a database with help of Drizzle ORM to store the customer information and verify the validity of their API key. To speed up retrieval of customer data I created a simple cache which stores the most recent customer in a variable.

## Decisions

A key decision was whether to implement a mock database or an actual database. Since this is a template for larger projects, a database is necessary to deploy an API to the real world.

Another consideration was to cache customer data and make the API request event a background job. I decided to cache a minimal amount of data to keep response times fast. However, background jobs weren't implemented to not overcomplicate the simple template.

## Summary

Despite the simplicity of the final product, I learned that working with different technologies can be tedious as an update may require major changes in the codebase. On the other hand, they are essential for a project like this one. Without the Stripe API, monthly billing wouldn't have been possible.
