const firebaseConfig = {
    apiKey: "AIzaSyD9eBYKEv4Oxd77lic4B6ecJHnlCd52GPY",
    authDomain: "bustracker-nhs.firebaseapp.com",
    databaseURL: "https://bustracker-nhs.firebaseio.com",
    projectId: "bustracker-nhs",
    storageBucket: "bustracker-nhs.appspot.com",
    messagingSenderId: "103544439176",
    appId: "1:103544439176:web:a0b0fee8fff6dc10f57a3d",
    measurementId: "G-Y117NQCTVX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
window.database = firebase.database();

// $(document).ready(function() { /* code here */ });
let name, email, photoUrl, uid, emailVerified;
firebase.auth().onAuthStateChanged(function (user) {
    window.user = user;
    if (user) {
        user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("Provider-specific UID: " + profile.uid);
            console.log("Name: " + profile.displayName);
            console.log("Email: " + profile.email);
            console.log("Photo URL: " + profile.photoURL);
            window.name = profile.displayName;
            window.email = profile.email;
            window.photoUrl = profile.photoURL;
            window.emailVerified = profile.email;
            window.uid = user.uid;
            database.ref('users/').child(user.uid).update({
                username: user.displayName,
                email: user.email,
                profile_picture: window.photoUrl
            });
        });
    } else {
    }
});

function sendSMS(input) {
    if (input === true) {
        document.getElementById("save").click();
    }
    if (user != null) {
        database.ref('users/' + user.uid).child('isAdmin').once('value').then(function (snapshot) {
            if (snapshot.val() === true) {
                let x = confirm("Are you sure? This will send a text message to every subscribed phone number!");
                if (x === true) {
                    const http = new XMLHttpRequest();
                    const url = 'https://busms.herokuapp.com/alert';
                    const params = 'send=true';
                    http.open('POST', url, true);
                    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    http.onreadystatechange = function () {
                        if (http.readyState === 4 && http.status === 200) {
                            alert(http.responseText);
                        }
                    };
                    http.send(params);
                }
            } else {
                alert('You are not authenticated to do that!');
                window.location.replace("index.html");
            }
        });
    } else {
        alert('You are not authenticated to do that!');
        window.location.replace("index.html");
    }
}

function logOut() {
    event.preventDefault();
    firebase.auth().signOut().catch(function (err) {// Handle errors
    });
    window.location = "index.html";
}