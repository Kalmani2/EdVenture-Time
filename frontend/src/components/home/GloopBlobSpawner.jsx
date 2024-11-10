// src/components/GloopBlobSpawner.js
import React, { useState, useEffect } from 'react'
import GloopBlob from './GloopBlob'

export default function GloopBlobSpawner() {
  const [blobs, setBlobs] = useState([])

  useEffect(() => {
    const spawnBlob = () => {
      const randomPosition = [
        (Math.random() - 0.5) * 10, // Random x position within a range
        Math.random() * 5 + 1,      // Random y position above ground
        (Math.random() - 0.5) * 10  // Random z position within a range
      ]
      setBlobs((prevBlobs) => [...prevBlobs, randomPosition])
    }

    // Spawn a new blob every 2 seconds
    const interval = setInterval(spawnBlob, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {blobs.map((position, index) => (
        <GloopBlob key={index} position={position} />
      ))}
    </>
  )
}
