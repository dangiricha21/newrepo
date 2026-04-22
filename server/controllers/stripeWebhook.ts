import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from '../lib/prisma.js';




export const stripeWebhook = async (request: Request, response: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  const signature = request.headers['stripe-signature'] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      endpointSecret
    );
  } catch (err: any) {
    console.log("❌ Webhook signature failed:", err.message);
    return response.sendStatus(400);
  }

  console.log("🔥 EVENT:", event.type);

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      const { transactionId, appId } = session.metadata as any;

      if (appId === 'ai-site-builder' && transactionId) {
        const transaction = await prisma.transaction.update({
          where: { id: transactionId },
          data: { isPaid: true }
        });

        await prisma.user.update({
          where: { id: transaction.userId },
          data: {
            credits: { increment: transaction.credits }
          }
        });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
};