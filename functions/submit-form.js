// --- TEMPORARY DEBUGGING SCRIPT for /functions/submit-form.js ---

export async function onRequest(context) {
  try {
    // Get the secret key from the environment variables
    const secretKey = context.env.TURNSTILE_SECRET_KEY;

    let message = "";

    if (secretKey) {
      // If the key is found, show the first few characters to verify it's correct
      message = "Success! The function found the Secret Key. It starts with: " + secretKey.substring(0, 4);
    } else {
      // If the key is NOT found, this is the error message
      message = "Error! The function could NOT find the TURNSTILE_SECRET_KEY. Please check your Environment Variables in the Cloudflare dashboard.";
    }

    // Return the message to the browser
    return new Response(JSON.stringify({ success: true, message: message }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'The function crashed: ' + error.message }), { status: 500 });
  }
}