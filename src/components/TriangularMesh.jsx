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
        const particleCount = window.innerWidth < 768 ? 30 : 50; // Responsive count
        const connectionDistance = 150;
        const connectionDistanceSq = connectionDistance * connectionDistance; // Avoid Math.sqrt
        const mouseDistance = 200;

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
                this.vx = (Math.random() - 0.5) * 0.3; // Slower, smoother
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2 + 1;
                this.neighbors = []; // Store neighbors for this frame
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Seamless wrap instead of bounce for smoother flow
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
                    const pushX = Math.cos(angle) * force * 0.5;
                    const pushY = Math.sin(angle) * force * 0.5;

                    this.vx -= pushX;
                    this.vy -= pushY;
                }

                // Reset neighbors
                this.neighbors = [];
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Update all particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }

            // 2. Find Neighbors (O(N^2) but strictly connection check)
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

            // 3. Draw Triangles (Only check mutual neighbors)
            ctx.fillStyle = 'rgba(201, 168, 117, 0.1)';
            ctx.strokeStyle = 'rgba(201, 168, 117, 0.15)';

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = 0; j < p1.neighbors.length; j++) {
                    const p2 = p1.neighbors[j];

                    // To avoid duplicates and ensuring we only draw triangles once:
                    // We can check if p2.index > p1.index (if we had indices) 
                    // or just rely on the fact that we iterate P1s and then its neighbors.
                    // A simple way to avoid drawing the same triangle 3ms is to only check neighbors of P2 that are ALSO neighbors of P1.

                    for (let k = j + 1; k < p1.neighbors.length; k++) {
                        const p3 = p1.neighbors[k];

                        // Check if p2 and p3 are neighbors
                        const dx = p2.x - p3.x;
                        const dy = p2.y - p3.y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq < connectionDistanceSq) {
                            // Draw Triangle
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.lineTo(p3.x, p3.y);
                            ctx.closePath();

                            // Opacity based on distance (simplified)
                            // Using squared distance prevents sqrt calls, roughly estimating
                            // Just use a fixed low opacity for performance/style
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                }
            }
            requestAnimationFrame(animate);
        };

        // Mouse Move Listener
        const handleMouseMove = (e) => {
            // Get relative position if canvas is not full screen, 
            // but here we align with viewport in CSS, so clientX/Y works
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
                zIndex: 0,
                pointerEvents: 'none' // Let clicks pass through to Hero buttons
            }}
        />
    );
};

export default TriangularMesh;
