function createParticles(canvas, interactive = false) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const mouse = { x: null, y: null, radius: 150 };

    if(interactive){
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.x - canvas.getBoundingClientRect().left;
            mouse.y = e.y - canvas.getBoundingClientRect().top;
        });
    }

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor(x, y, size, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            if(interactive){
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    this.x -= dx * 0.02;
                    this.y -= dy * 0.02;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "#58a6ff";
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < 80; i++) {
            let size = Math.random() * 3 + 1;
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let speedX = (Math.random() - 0.5) * 1;
            let speedY = (Math.random() - 0.5) * 1;
            particlesArray.push(new Particle(x, y, size, speedX, speedY));
        }
    }

    function connect() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = "rgba(88,166,255," + (1 - distance / 120) + ")";
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
        connect();
        requestAnimationFrame(animate);
    }

    init();
    animate();
}

// Partículas principais interativas
createParticles(document.getElementById("particles"), true);

// Partículas desfocadas em todas as outras seções
document.querySelectorAll(".particles-blur").forEach(c => createParticles(c, false));
