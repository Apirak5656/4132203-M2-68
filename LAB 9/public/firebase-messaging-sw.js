importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// ใช้ Config ชุดเดียวกับใน app.js
firebase.initializeApp({
    apiKey: "AIzaSyAg2XW2GBPvQUzyO9onrFZ7kdFI5D9eOU4",
    authDomain: "project-1050599379193285290.firebaseapp.com",
    projectId: "project-1050599379193285290",
    storageBucket: "project-1050599379193285290.firebasestorage.app",
    messagingSenderId: "191150797184",
    appId: "1:191150797184:web:d24f189786e41c14439165"
});

const messaging = firebase.messaging();

// จัดการข้อความเมื่อปิดหน้าเว็บหรืออยู่เบื้องหลัง (Background)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received ', payload);

    const notificationTitle = payload.notification.title || "หัวข้อแจ้งเตือน";
    const notificationOptions = {
        body: payload.notification.body || "เนื้อหาข้อความ",
        icon: '/firebase-logo.png' // ใส่รูปไอคอนของคุณที่นี่
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});