// --- TEMPORARY DEBUGGING SCRIPT ---

export async function onRequest(context) {
  try {
    // Try to get the secret key from the environment variables
    const secretKey = context.env.TURNSTILE_SECRET_KEY;

    let message = "";

    if (secretKey) {
      // If the key is found, report success
      message = "Success! The function found the Secret Key. It starts with: " + secretKey.substring(0, 4);
    } else {
      // If the key is NOT found, report the error
      message = "Error! The function could NOT find the TURNSTILE_SECRET_KEY. Please check your Environment Variables and redeploy.";
    }

    // Return the message to the browser
    return new Response(JSON.stringify({ success: true, message: message }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'The function crashed: ' + error.message }), { status: 500 });
  }
}