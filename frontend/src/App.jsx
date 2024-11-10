import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Box, OrbitControls, Environment, Sphere } from '@react-three/drei'
import './App.css'

import MedievalScene from './components/1/MedievalScene'
import RomanScene from './components/2/RomanScene'
import Home from './components/home/Home'
import ArrowThrower from './components/1/ArrowThrower'

function ReflectiveSphere() {
  return (
    <Sphere args={[1, 128, 128]} position={[0, 0, 0]}>
      <meshStandardMaterial metalness={1} roughness={0} />
    </Sphere>
  )
}

function App() {
  return (
    <div className="app-container">
      {/* <Home/> */}
      <RomanScene />
      {/* <ArrowThrower/> */}
      {/* <RomanScene/> */}
    </div>
  )
}

export default App
