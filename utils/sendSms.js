import twilio from 'twilio';

// const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const client = new twilio('ACc422e788670327da756bd4832b96415d', 'd68559d20a821e95d23dfe5b9712a3e0');

// Generate a random OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Send a custom SMS message
async function sendCustomSMS(phoneNumber, message) {
  try {
    await client.messages.create({
      body: message,
      to: phoneNumber,
      from: '+14143759961',
    });

    return true;
  } catch (error) {
    console.error(error);
    return false; // Return false to indicate a failure
  }
}

export { generateOTP, sendCustomSMS };
