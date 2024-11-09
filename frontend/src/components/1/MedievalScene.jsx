import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Html } from '@react-three/drei'
import { AxesHelper, GridHelper } from 'three'
import FirstPersonCamera from '../FirstPersonCamera'
import FloorWithEXRTexture from '../FloorWithEXRTexture'
import GLBAsset from '../GLBAsset'
import AssetQuiz from '../AssetQuiz'

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
          <GLBAsset filePath="/1/TortureDevice.glb" scale={[1, 1, 1]} position={[-4, 0, 0]} name="Gibbet" message=""/>
          <GLBAsset filePath="/1/Barrel.glb" scale={[0.6, 0.6, 0.6]} position={[-2, 0, 0]} name="Barrell" message="I am a barrell. gay"/>
          <GLBAsset filePath="/1/Castle.glb" scale={[20, 20, 20]} position={[6, 0, 0]} />
          <GLBAsset filePath="/1/Catapult.glb" scale={[1, 1, 1]} position={[20, 0, 0]} name="Catapult" message="This is a catapult"/>
          <GLBAsset filePath="/1/Knight.glb" scale={[0.3, 0.3, 0.3]} position={[0, 0, 0]} name="Knight" message="Greetings, traveler! The realm is full of perils, but bravery leads to glory. Stay vigilant, and may fortune favor your quest." interactable={true}/>
          <AssetQuiz filePath="/1/King.glb" scale={[1, 1, 1]} position={[0, 0, 0]} jsonFile="../../1/medieval.json" name="King"/>
        </Suspense>

        <FirstPersonCamera />
      </Canvas>
    </div>
  )
}
