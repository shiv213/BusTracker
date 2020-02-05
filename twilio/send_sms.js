// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC6d7b00dc8e42ad97c8898928f35f802d';
const authToken = '995cce2b0621e06bd110e6586ff09075';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Welcome to BuSMS! Save this number as a contact to make it more recognizable in the future!',
        from: '+15005550006',
        to: '+16785279430'
    })
    .then(message => console.log(message.sid));