const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const CURRENT_NUMBER = process.env.CURRENT_NUMBER;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;

exports.handler = async (event, context, callback) => {
  const urlParams = new URLSearchParams(event.body);
  const params = Object.fromEntries(urlParams);

  if (!params.Body || !params.From) {
    return Response.json({
      success: false,
      message: "Invalid request",
      status: 400,
    });
  }

  try {
    const message = await client.messages.create({
      body: params.Body,
      from: params.From || TWILIO_NUMBER,
      to: CURRENT_NUMBER,
    });

    console.log(message.sid); // Log the call SID for reference

    return Response.json({
      success: true,
      message: "Message sent successfully",
      status: 200,
    });

    // return new Response(twiml.toString(), {
    //   headers: { "Content-Type": "text/xml" },
    // });
  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
      message: "Failed to send message",
      status: 500,
    });
  }
};
