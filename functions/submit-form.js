// This is the final version using Web3Forms for the .pages.dev domain

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const formData = await context.request.formData();
    const body = Object.fromEntries(formData);

    // --- Turnstile Verification (This part stays the same) ---
    const turnstileToken = formData.get('cf-turnstile-response');
    const ip = context.request.headers.get('CF-Connecting-IP');
    
    let turnstileFormData = new FormData();
    turnstileFormData.append('secret', context.env.TURNSTILE_SECRET_KEY); 
    turnstileFormData.append('response', turnstileToken);
    turnstileFormData.append('remoteip', ip);

    const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: turnstileFormData,
      method: 'POST',
    });

    const turnstileOutcome = await turnstileResult.json();
    if (!turnstileOutcome.success) {
      return new Response(JSON.stringify({ success: false, message: 'Bot verification failed. Please try again.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // --- End Turnstile Verification ---

    // --- NEW: Sending data to Web3Forms ---
    const web3FormsRequest = new Request('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '4306c25c-b7da-4a01-a9f2-79cb81c2a941', // <-- PASTE YOUR KEY HERE
        subject: `New Inquiry from ${body.name}`,
        from_name: 'Website Contact Form',
        name: body.name,
        email: body.email,
        phone: body.phone,
        service: body.service,
        location: body.location,
        message: body.message,
      }),
    });

    const web3FormsResponse = await fetch(web3FormsRequest);
    const web3FormsData = await web3FormsResponse.json();

    if (web3FormsData.success) {
        return new Response(JSON.stringify({ success: true, message: 'Thank you! Your message has been sent.' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ success: false, message: web3FormsData.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'A server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}