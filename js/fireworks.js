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
            this.size = Math.random() * 5 + 3;
            this.speedX = (Math.random() - 0.5) * 12;
            this.speedY = Math.random() * -20 - 5;
            this.gravity = 0.35;
            this.opacity = 1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.3;

            const colorGroup = Math.random();
            if (colorGroup < 0.33) {
                this.color = `hsl(${Math.random() * 30 + 35}, 100%, 65%)`; // Vàng Gold
            } else if (colorGroup < 0.66) {
                this.color = `hsl(${Math.random() * 40 + 180}, 100%, 60%)`; // Xanh Cyan
            } else {
                this.color = `hsl(${Math.random() * 40 + 300}, 100%, 60%)`; // Hồng Neon
            }
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.opacity -= 0.007;
            this.rotation += this.rotationSpeed;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;

            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(0, -this.size);
                ctx.rotate(Math.PI / 5);
                ctx.lineTo(0, -this.size * 0.4);
                ctx.rotate(Math.PI / 5);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
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

    const rainInterval = setInterval(() => {
        const targetX = launcherX[Math.floor(Math.random() * launcherX.length)];
        for (let i = 0; i < 10; i++) {
            stars.push(new Star(targetX));
        }
    }, 60);

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawLaunchers();

        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            stars[i].draw();
            if (stars[i].opacity <= 0) { stars.splice(i, 1); i--; }
        }
        if (stars.length > 0 || canvas.parentElement) requestAnimationFrame(animate);
    }
    animate();

    // Cleanup after 10 seconds
    setTimeout(() => {
        clearInterval(rainInterval);
        fwSound.pause();
        if (canvas.parentElement) canvas.remove();
        if (overlay.parentElement) overlay.remove();
    }, 10000);
}
