import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Sử dụng đúng thông số bạn vừa gửi
const firebaseConfig = {
  apiKey: "AIzaSyC6zlWn8BKYU7P6A2-PYq6IIWOzaqJWFhc",
  authDomain: "gamhoctap.firebaseapp.com",
  databaseURL: "https://gamhoctap-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gamhoctap",
  storageBucket: "gamhoctap.firebasestorage.app",
  messagingSenderId: "833329613932",
  appId: "1:833329613932:web:0d8574827bcfe50b535c49",
  measurementId: "G-YT1PKCYS67"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Lấy tham số tuần từ URL (?week=19)
const urlParams = new URLSearchParams(window.location.search);
const currentWeek = urlParams.get('week');
const studentId = "HS_TEST_01"; // Giả định ID học sinh

// Danh sách link game tương ứng từng tuần (Bạn thay link Wordwall của bạn vào đây)
// js/play.js

const gameData = {
    "19": "https://edurobot-chinh-phuc-toan-5.netlify.app/tisophantram",
    "20": "https://edurobot-chinh-phuc-toan-5.netlify.app/tilebandovaungdung",
    "21": "https://edurobot-chinh-phuc-toan-5.netlify.app/tongtiso",
    "22": "https://edurobot-chinh-phuc-toan-5.netlify.app/hieutiso",
    // Các tuần tiếp theo bạn sẽ bổ sung dần...
};

if (currentWeek) {
    document.getElementById('week-title').innerText = "Thử thách Tuần " + currentWeek;
    const gameArea = document.getElementById('game-frame-area');
    
    if (gameData[currentWeek]) {
        gameArea.innerHTML = `<iframe src="${gameData[currentWeek]}" allowfullscreen></iframe>`;
    } else {
        gameArea.innerHTML = `<p>Trò chơi cho tuần này đang được cập nhật...</p>`;
    }
}

// Xử lý khi nhấn nút Lưu điểm
document.getElementById('btn-save').onclick = function() {
    const score = 100; // Trong bước này ta giả định đạt 100 điểm khi nhấn nút
    const scoreRef = ref(db, `students/${studentId}/week${currentWeek}`);
    
    set(scoreRef, {
        point: score,
        status: "Completed",
        timestamp: Date.now()
    }).then(() => {
        alert("Chúc mừng! Bạn đã chinh phục thành công tuần " + currentWeek);
        window.location.href = 'index.html'; // Quay về bản đồ
    }).catch((error) => {
        console.error("Lỗi khi lưu điểm:", error);
    });
};