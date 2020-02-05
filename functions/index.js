// // // Create and Deploy Your First Cloud Functions
// // // https://firebase.google.com/docs/functions/write-firebase-functions
// //
// // exports.helloWorld = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });
//
// const functions = require('firebase-functions');
// // const http = require('http');
// // const express = require('express');
// const MessagingResponse = require('twilio').twiml.MessagingResponse;
// // const bodyParser = require('body-parser');
// // const app = express();
// // app.use(bodyParser.urlencoded({ extended: false }));
//
// const firebase = require('firebase/app');
// require('firebase/database');
//
// // const app = firebase.initializeApp({
// //     apiKey: "AIzaSyD9eBYKEv4Oxd77lic4B6ecJHnlCd52GPY",
// //     authDomain: "bustracker-nhs.firebaseapp.com",
// //     databaseURL: "https://bustracker-nhs.firebaseio.com",
// //     projectId: "bustracker-nhs",
// //     storageBucket: "bustracker-nhs.appspot.com",
// //     messagingSenderId: "103544439176",
// //     appId: "1:103544439176:web:a0b0fee8fff6dc10f57a3d",
// //     measurementId: "G-Y117NQCTVX"
// // });
//
// exports.webhook = functions.https.onRequest((req, res) => {
//         const twiml = new MessagingResponse();
//         const body = req.body.Body.toLowerCase() ;
//         const from = req.body.From;
//         console.log(req.body.Body);
//         console.log(req.body.From);
//         if (body.startsWith("follow ")) {
//             let rawNum = body.substring(7);
//             firebase.database().ref('sms/' + from).set({
//                 busNum: rawNum
//             });
//             twiml.message(`Welcome to BuSMS! You are now following ${rawNum}`);
//         } else if (["cancel", "end", "quit", "stop", "stopall", "unsubscribe", "start", "unstop", "yes", "help", "info"].indexOf(body) >= 0) {
//         } else {
//             twiml.message(
//                 'Sorry, I don\'t understand! \nReply HELP for help. \nReply STOP to unsubscribe. Msg&Data rates may apply.'
//             );
//         }
//
//         res.writeHead(200, { 'Content-Type': 'text/xml' });
//         res.end(twiml.toString());
//     });
//
//
// // app.post('/sms', (req, res) => {
// //     // const twiml = new MessagingResponse();
// //     // const body = req.body.Body.toLowerCase() ;
// //     // const from = req.body.From;
// //     // console.log(req.body.Body);
// //     // console.log(req.body.From);
// //     // if (body.startsWith("follow ")) {
// //     //     let rawNum = body.substring(7);
// //     //     firebase.database().ref('sms/' + from).set({
// //     //         busNum: rawNum
// //     //     });
// //     //     twiml.message(`Welcome to BuSMS! You are now following ${rawNum}`);
// //     // } else if (["cancel", "end", "quit", "stop", "stopall", "unsubscribe", "start", "unstop", "yes", "help", "info"].indexOf(body) >= 0) {
// //     // } else {
// //     //     twiml.message(
// //     //         'Sorry, I don\'t understand! \nReply HELP for help. \nReply STOP to unsubscribe. Msg&Data rates may apply.'
// //     //     );
// //     // }
// //     //
// //     // res.writeHead(200, { 'Content-Type': 'text/xml' });
// //     // res.end(twiml.toString());
// // });
//
// // http.createServer(app).listen(1337, () => {
// //     console.log('Express server listening on port 1337');
// // });
