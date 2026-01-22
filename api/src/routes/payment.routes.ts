import express from 'express';
import paymentController from '../controllers/payment.controller';
import webhookController from '../controllers/webhook.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// 1. Create Session (Used by Frontend "Upgrade" button)
// This is protected because we need to know WHO is paying.
router.post(
  '/create-checkout-session', 
  authenticate, 
  paymentController.createCheckoutSession
);

// 2. Webhook (Used by Stripe Servers)
// This must be PUBLIC (no authenticate middleware) because Stripe sends it.
// We apply 'express.raw' specifically here to handle the signature verification.
router.post(
  '/webhook', 
  express.raw({ type: 'application/json' }), 
  webhookController.handleStripeWebhook
);

export default router;