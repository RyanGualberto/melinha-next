import apiClient from "@/config/api-client";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getMessaging,
  onMessage,
  getToken,
  Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD-1EneMt0DJHbMcrSE4xJr2w6M6t6OCsk",
  authDomain: "melinhaacai.firebaseapp.com",
  projectId: "melinhaacai",
  storageBucket: "melinhaacai.firebasestorage.app",
  messagingSenderId: "729911977213",
  appId: "1:729911977213:web:400626a242766424d48a94",
  measurementId: "G-67PEZ8DB9T",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let messaging: Messaging | null = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { app, messaging, onMessage, getToken };

export const requestPermissionAndSendToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("messaging", messaging, permission);

    if (permission === "granted" && messaging) {
      console.log("step 0");
      
      const swRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      
      console.log("step 1");
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });
      console.log("step 2");

      await apiClient.post("/users/save-token", {
        token,
      });
      console.log("step 3");
      
    }
  } catch (err) {
    console.error("Erro ao obter token:", err);
  }
};
