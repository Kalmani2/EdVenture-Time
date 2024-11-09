import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { AxesHelper, GridHelper } from 'three'
import FloorWithEXRTexture from '../FloorWithEXRTexture'
import GLBAsset from '../GLBAsset'
import FirstPersonCamera from '../FirstPersonCamera'

export default function RomanScene() {
  return (
    <div style={{ height: '100vh' }}>
      <Canvas
        camera={{
          position: [0, 1.5, 3],
          fov: 50,
        }}
      >
        <OrbitControls />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <primitive object={new AxesHelper(5)} />
        <primitive object={new GridHelper(10, 10)} />
        <Suspense fallback={null}>
          <Environment files="/rogland_clear_night_4k.hdr" background />
          <FloorWithEXRTexture />

          <GLBAsset filePath="/1/TortureDevice.glb" scale={[1, 1, 1]} position={[-4, 0, 0]} />
          <GLBAsset filePath="/1/Barrel.glb" scale={[1, 1, 1]} position={[-2, -0.5, 0]} />
          <GLBAsset filePath="/1/Castle Fortress.glb" scale={[5, 5, 5]} position={[30, 0, 0]} />
          <GLBAsset filePath="/1/Castle.glb" scale={[20, 20, 20]} position={[6, 0, 0]} />
          <GLBAsset filePath="/1/Catapult.glb" scale={[0.5, 0.5, 0.5]} position={[20, 0, 0]} />
        </Suspense>

        <FirstPersonCamera />
      </Canvas>
    </div>
  )
}
