import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { Box, OrbitControls, Environment, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'



import MedievalScene from './components/1/MedievalScene'

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
    <Sphere args={[1, 128, 128]} position={[0, 0, 0]}>
      <meshStandardMaterial metalness={1} roughness={0} />
    </Sphere>
  )
}

function App() {
  return (
    <div style={{ height: '100vh' }}>
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
        <axesHelper args={[5]} />
        <gridHelper args={[10, 10]} />
        <Suspense fallback={null}>
          <Environment files="/rogland_clear_night_4k.hdr" background />
        </Suspense>
      </Canvas>

      <MedievalScene />
    </div>
  )
}

export default App
