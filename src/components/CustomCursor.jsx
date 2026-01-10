import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('.cursor-hover-trigger')) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('.cursor-hover-trigger')) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <motion.div
            className="custom-cursor"
            variants={{
                default: {
                    x: mousePosition.x - 10,
                    y: mousePosition.y - 10,
                    width: 20,
                    height: 20,
                    mixBlendMode: 'difference'
                },
                hover: {
                    x: mousePosition.x - 30,
                    y: mousePosition.y - 30,
                    width: 60,
                    height: 60,
                    opacity: 0.5,
                    mixBlendMode: 'normal',
                    backgroundColor: 'rgba(201, 168, 117, 0.4)'
                }
            }}
            animate={isHovering ? "hover" : "default"}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                borderRadius: '50%',
                backgroundColor: '#fff',
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
};

export default CustomCursor;
