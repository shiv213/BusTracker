const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
const firebase = require('firebase/app');
require('firebase/database');
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);
const port = process.env.PORT || 8080;
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://5d57f57b93464f039a95a50637b285e7@sentry.io/2192445' });

try {
    firebase.initializeApp({
        apiKey: "AIzaSyD9eBYKEv4Oxd77lic4B6ecJHnlCd52GPY",
        authDomain: "bustracker-nhs.firebaseapp.com",
        databaseURL: "https://bustracker-nhs.firebaseio.com",
        projectId: "bustracker-nhs",
        storageBucket: "bustracker-nhs.appspot.com",
        messagingSenderId: "103544439176",
        appId: "1:103544439176:web:a0b0fee8fff6dc10f57a3d",
        measurementId: "G-Y117NQCTVX"
    });
} catch (err) {
    Sentry.captureException(err);
}

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    const body = req.body.Body.toLowerCase();
    const fromX = req.body.From;
    console.log(req.body.Body);
    console.log(req.body.From);
    if (body.startsWith("follow ")) {
        let rawNum = body.substring(7);
        if (isNaN(parseInt(rawNum))) {
            twiml.message(
                'Sorry, I don\'t understand! \nReply HELP for help. \nReply STOP to unsubscribe. Msg&Data rates may apply.'
            );
        } else {
            firebase.database().ref('sms/' + fromX).set({
                busNum: rawNum
            });
            twiml.message(`Welcome to BuSMS! You are now following Bus ${rawNum}! \nReply HELP for help. \nReply STOP to unsubscribe. Msg&Data rates may apply.`);
        }
    } else if (["cancel", "end", "quit", "stop", "stopall", "unsubscribe", "start", "unstop", "yes", "help", "info"].indexOf(body) >= 0) {
    } else {
        twiml.message(
            'Sorry, I don\'t understand! \nReply HELP for help. \nReply STOP to unsubscribe. Msg&Data rates may apply.'
        );
    }

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

app.post('/alert', (req, res) => {
    const body = req.body.send;
    console.log(body);
    // if (body === "true")
    firebase.database().ref('sms').once("value").then(function (snapshot) {
        snapshot.forEach(snapshot2 => {
            const key = snapshot2.key;
            snapshot2.forEach(number => {
                const val = number.val();
                console.log("Number: " + key + ", Bus: " + val);
                try {
                    getPos(key, val);
                } catch (err) {
                    Sentry.captureException(err);
                }
            });
        });
    });
    firebase.database().ref('info/').set({
        lastSent: new Date().toLocaleString()
    });
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end();
});

function getPos(key, val) {
    firebase.database().ref('bus').child("pos").once("value").then(function (snapshot) {
        let done = false;
        for (let x in snapshot.val()) {
            if (snapshot.val()[x] === val) {
                console.log(val + " - " + x);
                console.log(`Bus ${val} is the ${suffix(x.charAt(x.length - 1))} bus in Lane ${x.substring(1, x.indexOf('c'))} today!`);
                try {
                    client.messages
                        .create({
                            body: `Bus ${val} is the ${suffix(x.substring(1, x.indexOf('c')))} bus in Lane ${-(x.charAt(x.length - 1))+5} today!`,
                            from: '+14047774287',
                            to: key
                        })
                        .then(message => console.log(message.sid));
                } catch (err) {
                    Sentry.captureException(err);
                }
                done = true;
            }
        }
        if (!done) {
            try {
                client.messages
                    .create({
                        body: `Your bus number is either invalid or is temporarily being replaced by another, please check https://bustracker-nhs.web.app/ for updates!`,
                        from: '+14047774287',
                        to: key
                    })
                    .then(message => console.log(message.sid));

            } catch (err) {
                Sentry.captureException(err);
            }
        }
    });
}

function suffix(i) {
    const j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}


http.createServer(app).listen(port, () => {
    console.log('Express server listening on port ' + port);
});