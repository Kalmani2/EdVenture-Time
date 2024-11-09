import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { AxesHelper, GridHelper } from 'three'

import GLBAsset from '../GLBAsset'
import FirstPersonCamera from '../FirstPersonCamera'

export default function Home() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 1.15],
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
      </Suspense>
    </Canvas>
  )
}
