# Stripe Payment Setup Guide

## 1. Create a Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process

## 2. Get Your API Keys
1. In your Stripe Dashboard, go to **Developers > API keys**
2. Copy your **Publishable key** and **Secret key**
3. For testing, use the keys that start with `pk_test_` and `sk_test_`

## 3. Set Up Webhooks
1. In your Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## 4. Update Environment Variables
Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 5. Test the Integration
1. Start your development server: `npm run dev`
2. Add items to cart and proceed to checkout
3. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits

## 6. Go Live (Production)
1. Switch to **Live mode** in your Stripe Dashboard
2. Get your live API keys
3. Update your environment variables with live keys
4. Set up production webhooks
5. Update `NEXTAUTH_URL` to your production domain

## Features Implemented
- ✅ Stripe Checkout integration
- ✅ Payment processing
- ✅ Order creation on successful payment
- ✅ Success/Cancel pages
- ✅ Webhook handling
- ✅ Cart integration

## Security Notes
- Never commit your Stripe secret keys to version control
- Use environment variables for all sensitive data
- Enable webhook signature verification
- Test thoroughly before going live
