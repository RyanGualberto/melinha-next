importScripts("https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/11.7.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyD-1EneMt0DJHbMcrSE4xJr2w6M6t6OCsk",
  authDomain: "melinhaacai.firebaseapp.com",
  projectId: "melinhaacai",
  storageBucket: "melinhaacai.appspot.com",
  messagingSenderId: "729911977213",
  appId: "1:729911977213:web:400626a242766424d48a94",
  measurementId: "G-67PEZ8DB9T",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/profile.png",
  });
});
