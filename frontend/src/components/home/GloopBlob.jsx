// src/components/GloopBlob.js
import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import GloopBlobMaterial from './GloopBlobMaterial' // Import to ensure it's registered

function GloopBlob({ position = [0, 1, 0] }) {
  const ref = useRef()
  const { scene } = useThree()

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.time.value = clock.getElapsedTime()
      ref.current.uniforms.envMap.value = scene.environment // Link envMap for reflection
    }
  })

  return (
    <mesh position={position}>
      <sphereGeometry args={[1, 64, 64]} />
      <gloopBlobMaterial ref={ref} attach="material" envMapIntensity={20} />
    </mesh>
  )
}

export default GloopBlob
