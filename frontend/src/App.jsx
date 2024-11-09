import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { Box, OrbitControls, Environment, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'





import MedievalScene from './components/1/MedievalScene'
import RomanScene from './components/2/RomanScene'
import Home from './components/home/Home'
import ArrowThrower from './components/1/ArrowThrower'

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
      

      {/* <Home/> */}

      <MedievalScene />
      {/* <ArrowThrower/> */}
      {/* <RomanScene/> */}

    </div>
  )
}

export default App
