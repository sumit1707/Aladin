# Booking Submission Troubleshooting Guide

## Issue: Booking form not progressing to hotel options page

### Step 1: Check Browser Console
1. Open your browser's Developer Tools (F12 or right-click → Inspect)
2. Go to the **Console** tab
3. Submit a booking request
4. Look for console logs that start with:
   - "Starting booking submission..."
   - "Generating hotel options..."
   - "Saving booking to database..."
   - "Sending email notification..."
   - "Displaying hotel options..."

### Step 2: Check for Errors
Look for any RED error messages in the console. Common issues:

#### If you see "Missing required data":
- The trip data is incomplete. Try creating a new trip from scratch.

#### If you see "Database error":
- There might be a database permission issue
- Check that you're logged in
- Check the Network tab for failed requests to Supabase

#### If you see "Error processing booking":
- Check the full error message for details

### Step 3: Check Network Tab
1. In Developer Tools, go to the **Network** tab
2. Submit a booking request
3. Look for requests to:
   - Supabase API (booking_requests insert)
   - Edge function (send-booking-email)
4. Click on each request to see:
   - Status code (should be 200 or 201)
   - Response body
   - Any error messages

### Step 4: Email Setup (Required for actual emails)

The booking system will work WITHOUT email configured, but emails won't be sent. To enable email delivery:

1. Sign up for Resend at https://resend.com
2. Get your API key from the Resend dashboard
3. Go to your Supabase project: https://uoanqneaktqfukwunnhu.supabase.co
4. Navigate to: Settings → Edge Functions → Secrets
5. Add a new secret:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key
6. Restart the edge function

**Without RESEND_API_KEY configured:**
- Bookings will still be saved to the database
- Hotel options will still display
- Email content will be logged to edge function logs instead of sent

### Step 5: View Edge Function Logs
1. Go to Supabase dashboard
2. Navigate to: Edge Functions → send-booking-email
3. Click on "Logs" tab
4. Submit a booking and check if the function was called
5. Look for the email content in the logs

### Step 6: Verify Database Records
1. Go to Supabase dashboard
2. Navigate to: Table Editor → booking_requests
3. Check if your booking was saved
4. Look for the most recent record with your customer details

## Expected Behavior

When you click "Submit Request" on the booking form:
1. Form should close immediately
2. A success alert should appear (even if email fails)
3. Hotel options modal should open showing available hotels
4. Console should show progress logs
5. Database should have a new booking_requests record
6. Email should be sent (if RESEND_API_KEY is configured) or logged (if not configured)

## Still Having Issues?

Share the following information:
1. Console logs (all of them)
2. Network tab errors
3. Edge function logs from Supabase dashboard
4. Screenshot of the booking form when you click submit
