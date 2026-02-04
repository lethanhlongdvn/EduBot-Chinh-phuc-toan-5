/**
 * EduRobot Fireworks Celebration System
 * Integrated for scores >= 90
 * Updated: Lightweight Confetti Effect
 */

const fwAudioURL = 'https://cdn.jsdelivr.net/gh/Roelatriper/Arsene/music/fireworks.mp3';
let fwSound = new Audio(fwAudioURL);
fwSound.loop = true;

function startFireworks() {
    // 1. Create Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'fwCanvas';
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '10000',
        pointerEvents: 'none'
    });
    document.body.appendChild(canvas);

    // 2. Create Overlay Text
    const overlay = document.createElement('div');
    overlay.id = 'fwOverlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        width: '100%',
        zIndex: '10001',
        pointerEvents: 'none',
        fontFamily: "'Bungee', cursive"
    });

    const savedName = localStorage.getItem('studentName') || "Nhà thám hiểm";
    overlay.innerHTML = `
        <h1 style="font-size: 50px; margin: 0; background: linear-gradient(to right, #f1c40f, #ff00cc, #00ffff, #f1c40f); -webkit-background-clip: text; color: transparent; animation: fwShine 3s linear infinite;">CHÚC MỪNG CHIẾN THẮNG</h1>
        <div style="font-size: 35px; color: white; text-shadow: 0 0 15px #f1c40f; margin-top: 10px;">${savedName.toUpperCase()}</div>
    `;

    // 3. Add Keyframe Style
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fwShine { to { background-position: 300% center; } }
        #fwCanvas { background: rgba(0,0,0,0.4); }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // 4. Setup Context
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const launcherX = [canvas.width * 0.2, canvas.width * 0.4, canvas.width * 0.6, canvas.width * 0.8];

    // 5. Confetti Class (Lightweight)
    class Confetti {
        constructor(startX) {
            this.x = startX || Math.random() * canvas.width;
            this.y = canvas.height - 20;
            this.sizeW = Math.random() * 10 + 5;
            this.sizeH = Math.random() * 5 + 5;
            this.speedX = (Math.random() - 0.5) * 15;
            this.speedY = Math.random() * -15 - 8;
            this.gravity = 0.4;
            this.opacity = 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.1 + 0.05;

            const colors = ['#f1c40f', '#e74c3c', '#3498db', '#9b59b6', '#2ecc71', '#ff00cc', '#00ffff', '#ffffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.speedX *= 0.95;

            this.wobble += this.wobbleSpeed;
            this.x += Math.cos(this.wobble) * 1.5;

            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height - 100) {
                this.opacity -= 0.05;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.sizeW / 2, -this.sizeH / 2, this.sizeW, this.sizeH);
            ctx.restore();
        }
    }

    // 6. Animation Loop
    let particles = [];
    fwSound.currentTime = 0;
    fwSound.play().catch(() => console.log("Autoplay blocked"));

    // Spawn Confetti
    const rainInterval = setInterval(() => {
        const targetX = launcherX[Math.floor(Math.random() * launcherX.length)];
        for (let i = 0; i < 8; i++) {
            particles.push(new Confetti(targetX));
        }
    }, 50);

    function animate() {
        if (!canvas.parentElement) return; // Stop if removed

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Launchers (Optional visual)
        ctx.fillStyle = '#222';
        launcherX.forEach(x => {
            ctx.fillRect(x - 10, canvas.height - 30, 20, 30);
        });

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].opacity <= 0 || particles[i].y > canvas.height) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    // 7. Cleanup after 10 seconds
    setTimeout(() => {
        clearInterval(rainInterval);
        setTimeout(() => {
            fwSound.pause();
            if (canvas.parentElement) canvas.remove();
            if (overlay.parentElement) overlay.remove();
        }, 3000); // Wait for remaining particles to fall
    }, 10000);
}
