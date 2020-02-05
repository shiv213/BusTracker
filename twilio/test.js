const firebase = require('firebase/app');
require('firebase/database');
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

firebase.database().ref('sms').once("value").then(function (snapshot) {
    snapshot.forEach(snapshot2 => {
        const key = snapshot2.key;
        snapshot2.forEach(number => {
            const val = number.val();
            console.log("Number: " + key + ", Bus: " + val);
            getPos(key, val);
        });
    });
});

function getPos(key, val) {
    firebase.database().ref('bus').child("pos").once("value").then(function (snapshot) {
        for (let x in snapshot.val()) {
            // console.log(x);
            if (snapshot.val()[x] === val) {
                console.log(val + " - " + x);
                console.log(`Bus ${val} is the ${ordinal_suffix_of(x.charAt(x.length-1))} bus in Lane ${x.substring(1, x.indexOf('c'))} today!`);
                const accountSid = 'AC6d7b00dc8e42ad97c8898928f35f802d';
                const authToken = '995cce2b0621e06bd110e6586ff09075';
                const client = require('twilio')(accountSid, authToken);
                client.messages
                    .create({
                        body: `Bus ${val} is the ${ordinal_suffix_of(x.charAt(x.length-1))} bus in Lane ${x.substring(1, x.indexOf('c'))} today!`,
                        from: '+14049990287',
                        to: '+16785279430'
                    })
                    .then(message => console.log(message.sid));
                // process.exit();
            } else if (snapshot.val()[x] === -val) {

            }
        }
    });
}

function ordinal_suffix_of(i) {
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