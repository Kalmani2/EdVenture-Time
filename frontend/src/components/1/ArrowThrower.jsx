// src/components/ArrowThrower.js
import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Arrow({ initialPosition, initialVelocity }) {
  const arrowRef = useRef()
  const [position, setPosition] = useState(initialPosition.clone())
  const [velocity, setVelocity] = useState(initialVelocity.clone())
  const gravity = new THREE.Vector3(0, -9.81, 0)
  const dragFactor = 0.99

  useFrame((_, delta) => {
    if (position.y > 0) {
      const newVelocity = velocity.clone()
        .add(gravity.clone().multiplyScalar(delta)) // Apply gravity
        .multiplyScalar(dragFactor) // Apply drag
      const newPosition = position.clone().add(newVelocity.clone().multiplyScalar(delta))
      setPosition(newPosition)
      setVelocity(newVelocity)

      if (arrowRef.current) {
        arrowRef.current.position.copy(newPosition)
        arrowRef.current.lookAt(newPosition.clone().add(newVelocity))
      }
    }
  })

  return (
    <mesh ref={arrowRef} position={[position.x, position.y, position.z]}>
      <cylinderGeometry args={[0.05, 0.05, 1, 32]} />
      <meshStandardMaterial color="brown" />
    </mesh>
  )
}

function FirstPersonShooter() {
  const [arrows, setArrows] = useState([])
  const { camera, gl } = useThree()
  const mouse = useRef(new THREE.Vector2())

  useEffect(() => {
    camera.position.set(50, 50, 50)
  }, [camera])

  const throwArrow = () => {
    const initialPosition = camera.position.clone()
    const raycaster = new THREE.Raycaster()

    raycaster.setFromCamera(mouse.current, camera)
    const direction = raycaster.ray.direction.clone()

    const speed = 25
    const initialVelocity = direction.multiplyScalar(speed)

    setArrows([...arrows, { initialPosition, initialVelocity }])
  }

  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect()
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        throwArrow()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [arrows, gl])

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
  )
}

export default function ArrowThrower() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <FirstPersonShooter />
        <OrbitControls
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  )
}
