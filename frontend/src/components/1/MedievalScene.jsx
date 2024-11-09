import React, { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { Environment, OrbitControls, Sphere } from '@react-three/drei'
import { AxesHelper, GridHelper } from 'three'
import FloorWithEXRTexture from './FloorWithEXRTexture'
// import AluminumCan from './AluminumCan'
// import VictorianStreet from './VictorianStreet'
// import DrunkMan from './DrunkMan'
// import FloatingBlobs from './FloatingBlobs'

function VRSetup() {
  const { gl } = useThree()
  useEffect(() => {
    gl.xr.enabled = true
    document.body.appendChild(VRButton.createButton(gl))
  }, [gl])
  return null
}

function ReflectiveSphere() {
  return (
    <Sphere args={[1, 128, 128]} position={[0, 1, -2]}>
      <meshStandardMaterial metalness={1} roughness={0} />
    </Sphere>
  )
}

export default function MedievalScene() {
  return (
    <div style={{ height: '100vh' }}>
      <Canvas
        camera={{
          position: [0, 1.5, 3],
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
          {/* <AluminumCan position={[2, 1, 0]} /> */}
          <FloorWithEXRTexture/>
        </Suspense>
      </Canvas>
    </div>
  )
}
