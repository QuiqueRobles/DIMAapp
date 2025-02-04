import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const { email } = await req.json();

  // Generate password reset link with deep link redirect
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email: email,
    options: {
      redirectTo: "myapp://reset-password",
    },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  // Send email using Resend (replace with your email service)
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "no-reply@example.com",
      to: email,
      subject: "Password Reset Instructions",
      html: `<p>Click <a href="${data.properties.action_link}">here</a> to reset your password.</p>`,
    }),
  });

  if (!emailResponse.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify({ success: true }));
});