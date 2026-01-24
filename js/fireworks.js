/**
 * EduRobot Fireworks Celebration System
 * Integrated for scores >= 90
 */

const fwAudioURL = 'https://cdn.jsdelivr.net/gh/Roelatriper/Arsene/music/fireworks.mp3';
let fwSound = new Audio(fwAudioURL);
fwSound.loop = true;

function startFireworks() {
    const canvas = document.createElement('canvas');
    canvas.id = 'fwCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '10000';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const overlay = document.createElement('div');
    overlay.id = 'fwOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '40%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.textAlign = 'center';
    overlay.style.width = '100%';
    overlay.style.zIndex = '10001';
    overlay.style.pointerEvents = 'none';
    overlay.style.fontFamily = "'Bungee', cursive";

    const savedName = localStorage.getItem('studentName') || "Nhà thám hiểm";
    overlay.innerHTML = `
        <h1 style="font-size: 50px; margin: 0; background: linear-gradient(to right, #f1c40f, #ff00cc, #00ffff, #f1c40f); -webkit-background-clip: text; color: transparent; animation: fwShine 3s linear infinite;">CHÚC MỪNG CHIẾN THẮNG</h1>
        <div style="font-size: 35px; color: white; text-shadow: 0 0 15px #f1c40f; margin-top: 10px;">${savedName.toUpperCase()}</div>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fwShine { to { background-position: 300% center; } }
        #fwCanvas { background: rgba(0,0,0,0.4); }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 10;
            this.speedY = Math.random() * -15 - 10;
            this.gravity = 0.3;
            this.opacity = 1;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.opacity -= 0.01;
        }
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let stars = [];
    fwSound.play().catch(() => console.log("Autoplay blocked"));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.2) {
            for (let i = 0; i < 5; i++) stars.push(new Star());
        }
        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            stars[i].draw();
            if (stars[i].opacity <= 0) { stars.splice(i, 1); i--; }
        }
        if (stars.length > 0 || overlay.parentElement) requestAnimationFrame(animate);
    }
    animate();

    setTimeout(() => {
        fwSound.pause();
        if (canvas.parentElement) canvas.remove();
        if (overlay.parentElement) overlay.remove();
    }, 10000);
}
