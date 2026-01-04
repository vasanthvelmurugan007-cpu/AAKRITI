import React, { useRef, useEffect } from 'react';

const TriangularMesh = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration: "The Constellation"
        // Fewer particles, cleaner lines, no heavy fills.
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        const particleSpeed = 0.15; // Slow, majestic drift
        const connectionDistance = 140;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * particleSpeed;
                this.vy = (Math.random() - 0.5) * particleSpeed;
                this.size = Math.random() * 1.5;
                this.alpha = Math.random();
                this.alphaChange = (Math.random() * 0.02) - 0.01;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Breathe effect
                this.alpha += this.alphaChange;
                if (this.alpha <= 0.1 || this.alpha >= 1) this.alphaChange *= -1;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 168, 117, ${this.alpha})`;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Star());
            }
        };

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and Draw Particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw Connections (Constellation Lines)
            ctx.strokeStyle = 'rgba(201, 168, 117, 0.15)'; // Very subtle gold
            ctx.lineWidth = 0.5; // Fine lines

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        // Opacity based on distance (fade out at usage)
                        ctx.globalAlpha = 1 - (dist / connectionDistance);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 5, // Raised to ensure visibility over other backgrounds
                pointerEvents: 'none',
                opacity: 0.8 // Blend slightly
            }}
        />
    );
};

export default TriangularMesh;
