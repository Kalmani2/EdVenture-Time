// src/components/ArrowThrower.js
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Arrow({ initialPosition, initialVelocity }) {
    const arrowRef = useRef();
    const [position, setPosition] = useState(initialPosition.clone());
    const [velocity, setVelocity] = useState(initialVelocity.clone());
    const gravity = new THREE.Vector3(0, -9.81, 0); // Gravity

    useFrame((_, delta) => {
        if (position.y > 0) {
            // Apply physics to update velocity and position
            const newVelocity = velocity.clone().add(gravity.clone().multiplyScalar(delta));
            const newPosition = position.clone().add(newVelocity.clone().multiplyScalar(delta));
            setPosition(newPosition);
            setVelocity(newVelocity);

            // Update the arrow position and orientation
            arrowRef.current.position.copy(newPosition);
            arrowRef.current.lookAt(newPosition.clone().add(newVelocity));
        }
    });

    return (
        <mesh ref={arrowRef} position={[position.x, position.y, position.z]}>
            <cylinderGeometry args={[0.05, 0.05, 1, 32]} />
            <meshStandardMaterial color="brown" />
        </mesh>
    );
}

function FirstPersonShooter() {
    const [arrows, setArrows] = useState([]);
    const { camera } = useThree();

    useEffect(() => {
        // Set the camera position to ground level when the component mounts
        camera.position.set(0, 1.6, 0); // (x, y, z) - Adjust as desired
    }, [camera]);

    const throwArrow = () => {
        // Set arrow starting position just in front of the camera
        const initialPosition = camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1));

        // Set initial velocity based on camera direction
        const direction = camera.getWorldDirection(new THREE.Vector3());
        const speed = 10; // Base speed of the arrow
        const initialVelocity = direction.multiplyScalar(speed);

        setArrows([...arrows, { initialPosition, initialVelocity }]);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') { // Throw arrow when spacebar is pressed
                throwArrow();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [arrows]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            <Box position={[0, -0.5, 0]} args={[100, 0.1, 100]}>
                <meshStandardMaterial color="green" />
            </Box>
            {arrows.map((arrowProps, i) => (
                <Arrow key={i} {...arrowProps} />
            ))}
        </>
    );
}

export default function ArrowThrower() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas>
                <FirstPersonShooter />
                <OrbitControls
                    enablePan={false}
                    minPolarAngle={0} // Allow looking straight up
                    //maxPolarAngle={Math.PI / 2} // Limit looking down to 90 degrees
                    minDistance={5} // Minimum zoom distance
                    maxDistance={20} // Maximum zoom distance
                />
            </Canvas>
        </div>
    );
}
