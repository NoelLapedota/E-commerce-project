import stripe from 'stripe';

const stripeInstance = stripe(process.env.STRIPE_PASS);
import S from "fluent-json-schema";
import connection from "../db/db.js";


export default async function payment(fastify, opts) {
  fastify.route({
    method: 'POST',
    path: '/payment/:order_from_shopping',
    handler: payment,
    schema: {
        //order_from_shopping is a obj that return from shopping api

      params: S.object().prop('order_from_shopping'),
    },
  });

  async function payment(req, reply) {
    const products_json = req.params.order_from_shopping.products;

    try {
      const { amount } = orderFromShopping;
      const products_json = JSON.stringify(orderFromShopping);

      // Make the payment using Stripe
      const payment = await stripe.charges.create({
        amount: amount,
        currency: 'EUR',
        source: process.env.STRIPE_TOKEN, 
        description: 'Test payment',
      });

      // Insert payment details into the database
      await connection('accounts').insert({
        id: req.id,
        amount: amount,
        date: Date.now(),
        products: products_json,
      });

      reply.send({ ok: true });
    } catch (error) {
      console.error(error);
      httpErrors.internalServerError(500);
    }
  }
}


