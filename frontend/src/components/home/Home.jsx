
import React, { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { AxesHelper, GridHelper } from 'three'

function VRSetup() {
  const { gl } = useThree()
  useEffect(() => {
    gl.xr.enabled = true
    document.body.appendChild(VRButton.createButton(gl))
  }, [gl])
  return null
}

export default function Home() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 1.15],
        fov: 50,
      }}
    >
      <VRSetup />
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
