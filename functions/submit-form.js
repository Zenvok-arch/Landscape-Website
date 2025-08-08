// This is the final, secure, and corrected version of /functions/submit-form.js
export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const formData = await context.request.formData();
    const body = Object.fromEntries(formData);
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

    const emailMessage = `
      New Contact Form Submission:
      -----------------------------
      Name: ${body.name || 'N/A'}
      Email: ${body.email || 'N/A'}
      Phone: ${body.phone || 'N/A'}
      Service: ${body.service || 'N/A'}
      Location: ${body.location || 'N/A'}
      -----------------------------
      Message:
      ${body.message || 'N/A'}
    `;

    const emailRequest = new Request('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'apptravel037@gmail.com' }] }],
        from: {
          email: 'no-reply@landscape-43o.pages.dev',
          name: 'Website Contact Form',
        },
        subject: `New Inquiry from ${body.name}`,
        content: [{ type: 'text/plain', value: emailMessage }],
      }),
    });

    await fetch(emailRequest);

    return new Response(JSON.stringify({ success: true, message: 'Thank you! Your message has been sent.' }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'A server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}