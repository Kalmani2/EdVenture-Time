import React, { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { AxesHelper, GridHelper } from 'three'

import GLBAsset from '../GLBAsset'
import FirstPersonCamera from '../FirstPersonCamera'
import GloopBlobSpawner from './GloopBlobSpawner'

export default function Home({ onDoorHit }) {
  // Detect the "E" key press to trigger the scene change
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'e' || event.key === 'E') {
        onDoorHit() // Trigger scene switch to MedievalScene
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onDoorHit])

  return (
    <Canvas
      camera={{
        position: [0, 4, 1.15],
        fov: 105,
      }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <primitive object={new AxesHelper(5)} />
      <primitive object={new GridHelper(10, 10)} />
      <Suspense fallback={null}>
        <Environment files="/rogland_clear_night_4k.hdr" background />
        <GLBAsset filePath="/home/LivingRoom.glb" scale={[10, 10, 10]} position={[0, 0, 0]} name="Room" message="Welcome to the home scene!" />
        <GloopBlobSpawner />
      </Suspense>
      <FirstPersonCamera />
    </Canvas>
  )
}
