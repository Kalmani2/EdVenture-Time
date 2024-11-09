import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Html } from '@react-three/drei'
import { AxesHelper, GridHelper } from 'three'
import FirstPersonCamera from '../FirstPersonCamera'
import FloorWithEXRTexture from '../FloorWithEXRTexture'
import GLBAsset from '../GLBAsset'

export default function MedievalScene() {
  const [dialogueData, setDialogueData] = useState(null)

  const handleNPCClick = (message, position) => {
    setDialogueData({ message, position: [position[0], position[1] + 1.5, position[2]] })
  }

  const closeDialogue = () => {
    setDialogueData(null)
  }

  return (
    <div style={{ height: '100vh', position: 'relative' }} onClick={closeDialogue}>
      <Canvas
        camera={{
          position: [0, 2.5, 5], // Higher up (y: 2.5) and further back (z: 5)
          fov: 45,               // Reduced fov to zoom out slightly
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <primitive object={new AxesHelper(5)} />
        <primitive object={new GridHelper(10, 10)} />
        
        <Suspense fallback={null}>
          <Environment files="/rogland_clear_night_4k.hdr" background />
          <FloorWithEXRTexture />
          <GLBAsset filePath="/1/TortureDevice.glb" scale={[1, 1, 1]} position={[-4, 0, 0]} name="Gibbet" />
          <GLBAsset filePath="/1/Barrel.glb" scale={[1, 1, 1]} position={[-2, 0, 0]} name="Barrel" />
          <GLBAsset filePath="/1/Castle.glb" scale={[20, 20, 20]} position={[6, 0, 0]} />
          <GLBAsset filePath="/1/Catapult.glb" scale={[0.1, 0.1, 0.1]} position={[20, 0, 0]} name="Catapult" />
          <GLBAsset filePath="/1/Knight.glb" scale={[0.1, 0.1, 0.1]} position={[0, 0, 0]} name="Knight" />
        </Suspense>

        <FirstPersonCamera />
      </Canvas>
    </div>
  )
}
