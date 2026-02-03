const firebaseConfig = {
    apiKey: "AIzaSyAg2XW2GBPvQUzyO9onrFZ7kdFI5D9eOU4",
    authDomain: "project-1050599379193285290.firebaseapp.com",
    projectId: "project-1050599379193285290",
    storageBucket: "project-1050599379193285290.firebasestorage.app",
    messagingSenderId: "191150797184",
    appId: "1:191150797184:web:d24f189786e41c14439165"
};

// VAPID Key ต้องอยู่ในเครื่องหมายคำพูด "..." เสมอ
const VAPID_KEY = "BCC0yFYSX1QI_OBT1FAz6TKwltc8J1k_Qo9ysJxUAlnLLWp5UA2JhVTlPtNhMOSLzWpkFjF6wsdYTcbZSCwmFSg";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const statusText = document.getElementById('status-text');
const tokenContainer = document.getElementById('token-container');
const tokenDisplay = document.getElementById('token-display');
const copyBtn = document.getElementById('copy-btn');
const messageContainer = document.getElementById('message-container');
const latestMessage = document.getElementById('latest-message');

// ฟังก์ชันขออนุญาตแจ้งเตือนและดึง Token
async function initializeNotification() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            statusText.innerText = "ได้รับอนุญาตแล้ว กำลังดึง Token...";
            
            // ตรวจสอบว่ามี Service Worker ลงทะเบียนเรียบร้อยแล้วหรือไม่
            const registration = await navigator.serviceWorker.ready;
            
            const token = await messaging.getToken({ 
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration 
            });

            if (token) {
                tokenContainer.classList.remove('hidden');
                tokenDisplay.innerText = token;
                statusText.innerText = "พร้อมรับการแจ้งเตือน ✅";
                console.log("Token generated:", token);
            } else {
                statusText.innerText = "ไม่สามารถสร้าง Token ได้ ❌";
            }
        } else {
            statusText.innerText = "ผู้ใช้ปฏิเสธการแจ้งเตือน ❌";
        }
    } catch (error) {
        console.error("Error Detail:", error);
        statusText.innerText = "เกิดข้อผิดพลาด: " + error.message;
    }
}

// รับข้อความเมื่อแอปเปิดอยู่ (Foreground)
messaging.onMessage((payload) => {
    console.log('Message received (Foreground): ', payload);
    messageContainer.classList.remove('hidden');
    latestMessage.innerText = `${payload.notification.title}: ${payload.notification.body}`;
    
    new Notification(payload.notification.title, {
        body: payload.notification.body,
    });
});

// คัดลอก Token ไปยัง Clipboard
copyBtn.addEventListener('click', () => {
    const text = tokenDisplay.innerText;
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerText = "คัดลอกแล้ว!";
        setTimeout(() => copyBtn.innerText = "คัดลอก Token", 2000);
    }).catch(err => {
        // Fallback สำหรับเบราว์เซอร์เก่า
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyBtn.innerText = "คัดลอกแล้ว!";
        setTimeout(() => copyBtn.innerText = "คัดลอก Token", 2000);
    });
});

// เริ่มทำงาน
initializeNotification();