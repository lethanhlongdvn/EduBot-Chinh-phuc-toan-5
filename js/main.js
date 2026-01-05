import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// 1. Cấu hình Firebase của bạn
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

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Giả sử ID học sinh (Sau này dùng màn hình Login để lấy)
const studentId = "HS_TEST_01"; 

// 2. Hàm khởi tạo bản đồ
function initGame() {
    const studentRef = ref(db, 'students/' + studentId);

    // Lắng nghe dữ liệu thay đổi từ Firebase
    onValue(studentRef, (snapshot) => {
        const data = snapshot.val() || {};
        updateHeader(data);
        renderStations(data);
    });
}

// 3. Cập nhật thông tin trên Header
function updateHeader(data) {
    document.getElementById('student-name').innerText = data.name || "Nhà thám hiểm";
    
    // Tính tổng điểm từ tất cả các tuần
    let total = 0;
    for (let key in data) {
        if (key.startsWith('week') && data[key].point) {
            total += data[key].point;
        }
    }
    document.getElementById('total-score').innerText = total;
}

// 4. Tạo các trạm trên đường đi
function renderStations(data) {
    const pathContainer = document.getElementById('map-path');
    pathContainer.innerHTML = ''; // Xóa sạch để vẽ lại

    let canPlayNext = true; // Tuần 19 luôn mở

    for (let i = 19; i <= 34; i++) {
        const weekKey = 'week' + i;
        const score = (data[weekKey] && data[weekKey].point) ? data[weekKey].point : 0;
        
        const station = document.createElement('div');
        station.className = 'station';
        station.innerHTML = i;

        if (score > 0) {
            // Đã hoàn thành
            station.classList.add('completed');
            station.title = `Điểm: ${score}`;
            station.onclick = () => goToLevel(i);
        } else if (canPlayNext) {
            // Đang mở để chơi
            station.classList.add('active');
            station.onclick = () => goToLevel(i);
            canPlayNext = false; // Các tuần sau đó sẽ bị khóa
        } else {
            // Đang bị khóa
            station.classList.add('locked');
        }

        pathContainer.appendChild(station);
    }
}

function goToLevel(week) {
    // Chuyển hướng sang trang chơi game với tham số tuần
    window.location.href = `play.html?week=${week}`;
}

// Chạy game
initGame();