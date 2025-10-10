# Email Setup Guide

## Current Status
✅ Booking submission flow is now fixed
✅ Form stays open while processing
✅ Hotel options display after successful booking
❌ Email delivery requires RESEND_API_KEY configuration

## To Enable Email Delivery

### Step 1: Get Resend API Key
1. Go to https://resend.com and sign up (free tier: 100 emails/day)
2. Verify your email
3. Go to API Keys section in dashboard
4. Create a new API key
5. Copy the API key (starts with `re_`)

### Step 2: Add API Key to Supabase
1. Go to your Supabase dashboard: https://uoanqneaktqfukwunnhu.supabase.co
2. Click on your project
3. Navigate to: **Project Settings** → **Edge Functions**
4. Scroll to **Secrets** section
5. Click **Add new secret**
6. Enter:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (from Step 1)
7. Click **Save**

### Step 3: Verify Domain (Optional but Recommended)
For better email deliverability:
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Add your domain (or use the default `onboarding@resend.dev` for testing)
4. Follow DNS verification steps if using custom domain

### Step 4: Test Email Delivery
1. Submit a booking request through your app
2. Check the Supabase Edge Function logs:
   - Supabase Dashboard → **Edge Functions** → `send-booking-email` → **Logs**
3. Look for success message or errors
4. Check inbox at sumit.kumar.maheshka@gmail.com

## Without RESEND_API_KEY
The system works perfectly without the API key:
- ✅ Bookings are saved to database
- ✅ Hotel options are displayed
- ✅ Form closes after processing
- ✅ Email content is logged to Edge Function logs
- ❌ No actual email is sent

To see email content without sending:
1. Go to Supabase Dashboard
2. Navigate to: **Edge Functions** → `send-booking-email` → **Logs**
3. Submit a booking
4. View the email content in the logs

## Email Content
Emails sent to: **sumit.kumar.maheshka@gmail.com**

Subject: `New Booking Request: [Destination] - [Customer Name]`

Content includes:
- Customer details (name, email, phone)
- Trip details (destination, budget)
- Traveler counts (adults, children, seniors)
- Accommodation needs (hotels, rooms, cars)
- Room and vehicle preferences
- Special requests

## Troubleshooting
- **Email not received**: Check spam folder
- **API key error**: Verify the key is correct in Supabase secrets
- **Authorization error**: The edge function requires JWT verification
- **Domain not verified**: Use `onboarding@resend.dev` for testing
