import React, { useRef, useEffect } from 'react';

const TriangularMesh = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const particleCount = window.innerWidth < 768 ? 20 : 40;
        const particleSpeed = 0.2; // Reduced speed as requested
        const connectionDistance = 150;
        const connectionDistanceSq = connectionDistance * connectionDistance;
        const mouseDistance = 250; // Increased interaction radius

        // Resize Handler
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * particleSpeed;
                this.vy = (Math.random() - 0.5) * particleSpeed;
                this.size = Math.random() * 2 + 1;
                this.neighbors = [];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Seamless wrap
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Mouse Interaction
                const dx = mouseRef.current.x - this.x;
                const dy = mouseRef.current.y - this.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < mouseDistance * mouseDistance) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouseDistance - Math.sqrt(distSq)) / mouseDistance;

                    // Gentle push that feels responsive
                    const pushX = Math.cos(angle) * force * 1.5;
                    const pushY = Math.sin(angle) * force * 1.5;

                    this.vx -= pushX;
                    this.vy -= pushY;
                }

                // Friction to return to normal speed
                // This prevents them from flying off too fast after interaction
                const maxSpeed = 2;
                const v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (v > maxSpeed) {
                    this.vx = (this.vx / v) * maxSpeed;
                    this.vy = (this.vy / v) * maxSpeed;
                }

                this.neighbors = [];
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        let animationFrameId;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Update all particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }

            // 2. Find Neighbors
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectionDistanceSq) {
                        particles[i].neighbors.push(particles[j]);
                        particles[j].neighbors.push(particles[i]);
                    }
                }
            }

            // 3. Draw Triangles
            ctx.fillStyle = 'rgba(201, 168, 117, 0.1)';
            ctx.strokeStyle = 'rgba(201, 168, 117, 0.15)';

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = 0; j < p1.neighbors.length; j++) {
                    const p2 = p1.neighbors[j];

                    for (let k = j + 1; k < p1.neighbors.length; k++) {
                        const p3 = p1.neighbors[k];

                        const dx = p2.x - p3.x;
                        const dy = p2.y - p3.y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq < connectionDistanceSq) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.lineTo(p3.x, p3.y);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // Mouse Move Listener
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        handleResize(); // Init
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
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
