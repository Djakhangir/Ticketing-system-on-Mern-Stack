// SMS delivery is stubbed behind this interface. To go live, drop in a Twilio
// (or other) client here and read credentials from env — nothing else in the
// app needs to change.

const sendSMS = async ({ to, body }) => {
  if (!to) return { status: "skipped", reason: "no phone on file" };

  const provider = process.env.SMS_PROVIDER; // e.g. "twilio" when configured
  if (!provider) {
    // No provider configured: log so it's visible in dev, no-op otherwise.
    if (process.env.NODE_ENV !== "production") {
      console.log(`[SMS stub] to ${to}: ${body}`);
    }
    return { status: "stubbed" };
  }

  // Real provider integration goes here.
  return { status: "unimplemented", provider };
};

module.exports = { sendSMS };
