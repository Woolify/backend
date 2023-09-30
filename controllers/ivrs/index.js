import twilio from 'twilio';

// Twilio credentials TODO: replace with env variables
const accountSid = 'ACc422e788670327da756bd4832b96415d';
const authToken = 'd68559d20a821e95d23dfe5b9712a3e0';
const twilioPhoneNumber = '+14143759961';

//  TODO: replace with hosted ngrok url
const backend_URL = 'https://611c-103-173-25-205.ngrok-free.app';

const client = new twilio(accountSid, authToken);

function handleIVRS(userInput) {
  switch (userInput) {
    case '1':
      return 'You pressed 1. This is the current prices information.';
    case '2':
      return 'You pressed 2. Here are the available schemes and news.';
    case '3':
      return 'You pressed 3. Let\'s book a service for you.';
    default:
      return 'Invalid input. Please try again.';
  }
}

export const ivr = (req,res,next) => {
    const userDigits = req.body.Digits;

    const twiml = new twilio.twiml.VoiceResponse();
  
    if (!userDigits) {
      // IVR menu
      const gather = twiml.gather({
        input: 'dtmf',
        numDigits: 1,
        action: '/ivr',
      });
  
      gather.say('Press 1 for current prices, 2 for schemes, 3 to book a service for you.');
    } else {
      
      const responseMessage = handleIVRS(userDigits);
      twiml.say(responseMessage);
    }
  
    res.type('text/xml').send(twiml.toString());
}

export const makeCall = (req,res,next) => {
  const { phone } = req.body;

    client.calls
    .create({
      url: `${backend_URL}/api/ivrs/ivr`,
      to: phone,
      from: twilioPhoneNumber,
    })
    .then(call => {
      console.log(call.sid);
      res.send('Call initiated.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Call initiation failed.');
    });
}