
import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

export default function FirstPersonCamera() {
  const { camera, gl } = useThree()
  const controlsRef = useRef()
  const speed = 0.1

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,    
    right: false
  })

  useEffect(() => {
    gl.xr.enabled = true
    camera.position.set(0, 10, 10)

    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMovement((m) => ({ ...m, forward: true }))
          break
        case 'KeyS':
          setMovement((m) => ({ ...m, backward: true }))
          break
        case 'KeyA':
          setMovement((m) => ({ ...m, left: true }))
          break
        case 'KeyD':
          setMovement((m) => ({ ...m, right: true }))
          break
      }
    }

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMovement((m) => ({ ...m, forward: false }))
          break
        case 'KeyS':
          setMovement((m) => ({ ...m, backward: false }))
          break
        case 'KeyA':
          setMovement((m) => ({ ...m, left: false }))
          break
        case 'KeyD':
          setMovement((m) => ({ ...m, right: false }))
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [camera, gl])

  useFrame(() => {
    const direction = new THREE.Vector3()
    const velocity = new THREE.Vector3()

    if (movement.forward) velocity.z -= speed
    if (movement.backward) velocity.z += speed
    if (movement.left) velocity.x -= speed
    if (movement.right) velocity.x += speed

    direction.copy(velocity).normalize().multiplyScalar(speed)
    controlsRef.current?.getObject().position.add(direction)
  })

  return <PointerLockControls ref={controlsRef} args={[camera, gl.domElement]} />
}
