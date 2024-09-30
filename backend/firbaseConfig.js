const firebase = require("firebase")
  const firebaseConfig = {
    apiKey: "AIzaSyBHUwMDNjA1glkot6UFPer7n9PdLg6pNYQ",
    authDomain: "task-management-fdabf.firebaseapp.com",
    projectId: "task-management-fdabf",
    storageBucket: "task-management-fdabf.appspot.com",
    messagingSenderId: "456947807319",
    appId: "1:456947807319:web:7f901de983ead943c39f12",
    measurementId: "G-NS4Q4JVJJY"
  };

  firebase.initializeApp(firebaseConfig)
  const db=firebase.firestore()
  const User = db.collection("Users")

  module.exports = User