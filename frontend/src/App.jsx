import React, { useState } from 'react'
import Home from './components/home/Home'
import MedievalScene from './components/1/MedievalScene'

export default function App() {
  const [isInMedievalScene, setIsInMedievalScene] = useState(false)

  const switchToMedievalScene = () => setIsInMedievalScene(true)

  return (
    <>
      {isInMedievalScene ? (
        <MedievalScene />
      ) : (
        <Home onDoorHit={switchToMedievalScene} />
      )}
    </>
  )
}
