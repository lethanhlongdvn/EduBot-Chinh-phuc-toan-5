import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// 1. Cấu hình Firebase
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

// ID học sinh (Tạm thời cố định để test)
const studentId = "HS_TEST_01"; 

// 2. Hàm khởi tạo hành trình
function initGame() {
    const studentRef = ref(db, 'students/' + studentId);

    onValue(studentRef, (snapshot) => {
        const data = snapshot.val() || {};
        updateHeader(data);
        processStations(data);
    });
}

// 3. Cập nhật thông tin Header
function updateHeader(data) {
    const nameEl = document.getElementById('student-name');
    const scoreEl = document.getElementById('total-score');
    
    if(nameEl) nameEl.innerText = data.name || "Nhà thám hiểm";
    
    let total = 0;
    // Duyệt qua dữ liệu để cộng dồn điểm (point)
    Object.keys(data).forEach(key => {
        if (key.startsWith('week') && data[key].point) {
            total += data[key].point;
        }
    });
    if(scoreEl) scoreEl.innerText = total;
}

// 4. Logic khóa/mở các trạm dựa trên quy tắc 80%
function processStations(data) {
    // Chúng ta không render mới mà truy cập vào các ID st-19 -> st-33 đã có sẵn trên index.html
    let canPlay = true; // Bài 19 luôn mở đầu tiên

    for (let i = 19; i <= 33; i++) {
        const station = document.getElementById(`st-${i}`);
        if (!station) continue;

        const weekKey = 'week' + i;
        const weekData = data[weekKey] || {};
        const score = weekData.point || 0;
        
        // Xóa các class cũ trước khi cập nhật
        station.classList.remove('completed', 'locked', 'active');

        if (canPlay) {
            // Trường hợp: Trạm này được phép chơi
            if (score >= 80) {
                station.classList.add('completed');
                station.title = `Hoàn thành: ${score}%`;
                canPlay = true; // Đạt >= 80%, mở tiếp trạm sau
            } else if (score > 0 && score < 80) {
                station.classList.add('active'); // Đã làm nhưng chưa đủ 80%
                station.title = `Cần đạt 80% (Hiện tại: ${score}%)`;
                canPlay = false; // Bị kẹt lại ở trạm này, không mở trạm sau
            } else {
                station.classList.add('active'); // Trạm mới mở chưa có điểm
                station.title = "Sẵn sàng thám hiểm!";
                canPlay = false; // Chưa làm trạm này thì không mở trạm sau
            }
            
            // Cho phép bấm vào để thi
            station.onclick = () => {
                window.location.href = `bai${i}.html`; // Chuyển đến bài học tương ứng
            };

        } else {
            // Trường hợp: Trạm bị khóa do trạm trước chưa đạt yêu cầu
            station.classList.add('locked');
            station.title = "Bạn cần hoàn thành chặng trước với 80% điểm";
            station.onclick = (e) => {
                e.preventDefault();
                alert("🔒 Chặng này đang bị khóa! Hãy vượt qua chặng trước với ít nhất 80% số điểm.");
            };
        }
    }
}

initGame();