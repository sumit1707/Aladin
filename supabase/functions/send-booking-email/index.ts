import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingEmailRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destinationName: string;
  adults: number;
  children: number;
  seniors: number;
  numberOfHotels: number;
  numberOfRooms: number;
  numberOfCars: number;
  roomType: string;
  vehicleType: string;
  specialRequests: string;
  tripBudget: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const bookingData: BookingEmailRequest = await req.json();

    const emailContent = `
New Booking Request Received!

=================================
CUSTOMER DETAILS
=================================
Name: ${bookingData.customerName}
Email: ${bookingData.customerEmail}
Phone: ${bookingData.customerPhone}

=================================
TRIP DETAILS
=================================
Destination: ${bookingData.destinationName}
Budget Category: ${bookingData.tripBudget}

=================================
TRAVELERS
=================================
Adults: ${bookingData.adults}
Children: ${bookingData.children}
Seniors: ${bookingData.seniors}
Total Travelers: ${bookingData.adults + bookingData.children + bookingData.seniors}

=================================
ACCOMMODATION & TRANSPORT
=================================
Number of Hotels: ${bookingData.numberOfHotels}
Number of Rooms: ${bookingData.numberOfRooms}
Number of Cars: ${bookingData.numberOfCars}
Accommodation Type: ${bookingData.roomType}
Vehicle Type: ${bookingData.vehicleType}

=================================
SPECIAL REQUESTS
=================================
${bookingData.specialRequests || 'None'}

=================================

Please contact the customer within 24 hours to confirm and process this booking.
    `;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.log('Email notification (RESEND_API_KEY not configured):');
      console.log(emailContent);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Booking received (email service not configured)',
          emailContent 
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Travel Genie <onboarding@resend.dev>',
        to: ['sumit.kumar.maheshka@gmail.com'],
        subject: `New Booking Request: ${bookingData.destinationName} - ${bookingData.customerName}`,
        text: emailContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResult = await emailResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Booking confirmation email sent successfully',
        emailId: emailResult.id 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in send-booking-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process booking email' 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});