// src/components/FirstPersonCamera.js
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

export default function FirstPersonCamera({ onInteract }) {
  const { camera, gl, scene } = useThree()
  const speed = 5
  const direction = new THREE.Vector3()
  const keys = useRef({})
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  useEffect(() => {
    const handleKeyDown = (event) => {
      keys.current[event.code] = true
    }
    const handleKeyUp = (event) => {
      keys.current[event.code] = false
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    const handleClick = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0 && typeof onInteract === 'function') {
        onInteract(intersects[0].object)
      }
    }

    gl.domElement.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      gl.domElement.removeEventListener('click', handleClick)
    }
  }, [camera, gl, scene, onInteract])

  useFrame((_, delta) => {
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(camera.up, forward).normalize()

    direction.set(0, 0, 0)
    if (keys.current['KeyW']) direction.add(forward)
    if (keys.current['KeyS']) direction.sub(forward)
    if (keys.current['KeyA']) direction.add(right)
    if (keys.current['KeyD']) direction.sub(right)

    direction.normalize().multiplyScalar(speed * delta)
    camera.position.add(direction)
  })

  return <PointerLockControls />
}
