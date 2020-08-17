// Web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyBEc1kqK5qdjXNTINTMs7nhObAZDP7nEts",
authDomain: "tomato-firebase.firebaseapp.com",
databaseURL: "https://tomato-firebase.firebaseio.com",
projectId: "tomato-firebase",
storageBucket: "tomato-firebase.appspot.com",
messagingSenderId: "80494332293",
appId: "1:80494332293:web:19ac45d3c465b834b81cec",
measurementId: "G-QLS83VWLZM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// A reference to the database service
var database = firebase.firestore();

// A reference to firebase storage
var storage = firebase.storage();

// A authentication service
var auth = firebase.auth();