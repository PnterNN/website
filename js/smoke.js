/* ══════════════════════════════════════════════════════
   SMOKE — Canvas-based fog/smoke particles
   ══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const canvas = document.getElementById('smoke-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 35;
    let animationId;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class SmokeParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 120 + 40;
            this.speedY = -(Math.random() * 0.3 + 0.1);
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.opacity = 0;
            this.maxOpacity = Math.random() * 0.06 + 0.02;
            this.fadeInSpeed = Math.random() * 0.001 + 0.0005;
            this.fadeOutY = height * (Math.random() * 0.3 + 0.1);
            this.wobbleAmp = Math.random() * 0.3 + 0.1;
            this.wobbleSpeed = Math.random() * 0.008 + 0.003;
            this.wobbleOffset = Math.random() * Math.PI * 2;
            this.life = 0;
        }

        update() {
            this.life++;
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.life * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmp;

            // Fade in
            if (this.opacity < this.maxOpacity) {
                this.opacity += this.fadeInSpeed;
            }

            // Fade out as it goes up
            if (this.y < this.fadeOutY) {
                this.opacity *= 0.995;
            }

            // Reset when faded or off-screen
            if (this.opacity < 0.001 || this.y < -this.size) {
                this.reset();
            }
        }

        draw() {
            if (this.opacity <= 0) return;

            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, `rgba(201, 168, 76, ${this.opacity * 0.5})`);
            gradient.addColorStop(0.4, `rgba(180, 160, 120, ${this.opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(100, 90, 70, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = new SmokeParticle();
            // Distribute initial particles across the screen
            p.y = Math.random() * height;
            p.opacity = Math.random() * p.maxOpacity;
            particles.push(p);
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        animationId = requestAnimationFrame(animate);
    }

    // Handle visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });

    window.addEventListener('resize', () => {
        resize();
    });

    // Start
    init();
    animate();
})();
