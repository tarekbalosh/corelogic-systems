"use server";

export async function sendContactEmail(formData: FormData) {
  const honeypot = formData.get("website_url");
  if (honeypot) {
    // Spam detected
    return { success: false, error: "Spam detected." };
  }

  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const service = formData.get("service");
  const message = formData.get("message");

  if (!fullName || !email || !service) {
    return { success: false, error: "Missing required fields." };
  }

  // TODO: integrate with Resend, SendGrid, or nodemailer to actually deliver to contact@corelogic-system.my
  console.log("Sending email to contact@corelogic-system.my:", { fullName, email, phone, service, message });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}
