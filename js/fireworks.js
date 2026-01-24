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

    const launcherX = [canvas.width * 0.2, canvas.width * 0.4, canvas.width * 0.6, canvas.width * 0.8];

    class Star {
        constructor(startX) {
            this.x = startX || Math.random() * canvas.width;
            this.y = canvas.height - 30;
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 6;
            this.speedY = Math.random() * -18 - 12;
            this.gravity = 0.25;
            this.opacity = 1;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.opacity -= 0.008;
        }
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function drawLaunchers() {
        ctx.fillStyle = '#333';
        launcherX.forEach(x => {
            ctx.fillRect(x - 10, canvas.height - 40, 20, 40);
            ctx.strokeStyle = '#555';
            ctx.strokeRect(x - 10, canvas.height - 40, 20, 40);
        });
    }

    let stars = [];
    fwSound.play().catch(() => console.log("Autoplay blocked"));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawLaunchers();

        // Increased density: higher probability and more stars per burst
        if (Math.random() < 0.4) {
            const targetX = launcherX[Math.floor(Math.random() * launcherX.length)];
            for (let i = 0; i < 8; i++) stars.push(new Star(targetX));
        }

        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            stars[i].draw();
            if (stars[i].opacity <= 0) { stars.splice(i, 1); i--; }
        }
        if (stars.length > 0 || canvas.parentElement) requestAnimationFrame(animate);
    }
    animate();

    // Cleanup after 15 seconds
    setTimeout(() => {
        fwSound.pause();
        if (canvas.parentElement) canvas.remove();
        if (overlay.parentElement) overlay.remove();
    }, 15000);
}
