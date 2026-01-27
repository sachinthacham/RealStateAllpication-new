import { Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../middlewares/auth.middleware';
import { SUBSCRIPTION_PLANS, PlanType } from '../constants/plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover', 
});

const createCheckoutSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { plan } = req.body; // 'BUSINESS' or 'PREMIUM'
    const user = req.user!;

    // 1. Get Plan Details
    const selectedPlan = SUBSCRIPTION_PLANS[plan as PlanType];
    if (!selectedPlan) throw new Error('Invalid plan selected');

    // 2. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr',
            product_data: {
              name: `${selectedPlan.name} Membership`,
              description: `Access to ${selectedPlan.maxListings} listings`,
            },
            unit_amount: selectedPlan.price * 100, // Stripe expects amount in cents (e.g., 5000 LKR = 500000)
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // Use 'subscription' if you want recurring monthly billing
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        planType: plan,
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
};

export default { createCheckoutSession };