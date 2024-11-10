import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Html } from '@react-three/drei'
import { AxesHelper, GridHelper, Raycaster, Vector3 } from 'three'
import FirstPersonCamera from '../FirstPersonCamera'
import FloorWithEXRTexture from '../FloorWithEXRTexture'
import GLBAsset from '../GLBAsset'
import AssetQuiz from '../AssetQuiz'

export default function MedievalScene() {
  const [dialogueData, setDialogueData] = useState(null)

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'e') {
        checkForInteractableObject()
      }
    }
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const checkForInteractableObject = () => {
    const raycaster = new Raycaster()
    const cameraDirection = new Vector3()

    // Get the camera's current position and direction
    const { camera } = useThree()
    camera.getWorldDirection(cameraDirection)
    raycaster.set(camera.position, cameraDirection)

    // Get objects intersected by the ray
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object
      handleNPCClick(intersectedObject)
    }
  }

  const handleNPCClick = (object) => {
    const interactableObjects = {
      "Gibbet": "This is a Gibbet, a grim symbol from a dark past.",
      "Barrel": "A sturdy barrel. Who knows what it holds?",
      "Catapult": "A medieval catapult, ready to launch!",
      "Knight": "Greetings, traveler! The realm is full of perils, but bravery leads to glory."
    }

    const message = interactableObjects[object.name]
    if (message) {
      setDialogueData({
        message,
        position: [object.position.x, object.position.y + 1.5, object.position.z]
      })
    } else {
      setDialogueData(null)
    }
  }

  const closeDialogue = () => {
    setDialogueData(null)
  }

  return (
    <div style={{ height: '100vh', position: 'relative' }} onClick={closeDialogue}>
      <Canvas
        camera={{
          position: [0, 2.5, 5],
          fov: 75
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <primitive object={new AxesHelper(5)} />
        <primitive object={new GridHelper(10, 10)} />
        
        <Suspense fallback={null}>
          <Environment files="/rogland_clear_night_4k.hdr" background />
          <FloorWithEXRTexture />
          <GLBAsset filePath="/2/colosseum.glb" scale={[50, 50, 50]} position={[-4, 15, 0]} name="Gibbet" message=""/>
          <GLBAsset filePath="/2/RomanCenturion.glb" scale={[1, 1, 1]} position={[5, 2, -40]} name="Barrel" message=""/>
          <GLBAsset filePath="/2/RomanGuy.glb" scale={[3, 3, 3]} position={[10, 2, -20]} name="Barrel" message=""/>
        
          {/* <AssetQuiz filePath="/1/King.glb" scale={[1, 1, 1]} position={[0, 0, 0]} jsonFile="../../1/medieval.json" name="King"/> */}
        </Suspense>

        {/* FirstPersonCamera with onInteract prop removed, since interaction is now handled by pressing 'E' */}
        <FirstPersonCamera />

        {/* Display dialogue when available */}
        {dialogueData && (
          <Html position={dialogueData.position} center>
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                maxWidth: '200px',
                textAlign: 'center'
              }}
            >
              {dialogueData.message}
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  )
}
