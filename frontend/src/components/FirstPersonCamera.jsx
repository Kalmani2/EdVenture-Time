// src/components/FirstPersonCamera.js
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

export default function FirstPersonCamera() {
  const { camera } = useThree()
  const speed = 5
  const direction = new THREE.Vector3()
  const keys = useRef({})

  useEffect(() => {
    const handleKeyDown = (event) => {
      keys.current[event.code] = true
    }
    const handleKeyUp = (event) => {
      keys.current[event.code] = false
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(camera.up, forward).normalize()

    // Adjust directions for swapped left/right controls
    direction.set(0, 0, 0)
    if (keys.current['KeyW']) direction.add(forward)
    if (keys.current['KeyS']) direction.sub(forward)
    if (keys.current['KeyA']) direction.add(right) // Swapped: KeyA now adds right
    if (keys.current['KeyD']) direction.sub(right) // Swapped: KeyD now subtracts right

    direction.normalize()
    direction.multiplyScalar(speed * delta)

    camera.position.add(direction)
  })

  return <PointerLockControls /> 
}
