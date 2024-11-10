import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html } from '@react-three/drei'
import { AxesHelper, GridHelper, Raycaster, Vector3 } from 'three'
import FirstPersonCamera from '../FirstPersonCamera'
import FloorWithEXRTexture from '../FloorWithEXRTexture'
import GLBAsset from '../GLBAsset'
import AssetQuiz from '../AssetQuiz'
import narratorAudio from './audio.mp3' // Import your audio file

export default function MedievalScene() {
  const [dialogueData, setDialogueData] = useState(null)
  const [adventurerPosition, setAdventurerPosition] = useState(new Vector3(5, 0, 5))
  const [adventurerRotation, setAdventurerRotation] = useState([0, 0, 0]) // To store rotation
  const audioRef = useRef(new Audio(narratorAudio)) // Ref for audio instance

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'e') {
        checkForInteractableObject()
      }
      if (event.key === 'q') {
        audioRef.current.play() // Play audio on 'q' key press
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
    const { camera, scene } = useThree()

    camera.getWorldDirection(cameraDirection)
    raycaster.set(camera.position, cameraDirection)

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

  // Adventurer follow and face logic
  const AdventurerFollow = () => {
    const { camera } = useThree()
    const followSpeed = 0.05
    const distanceBehind = 7
    const previousCameraPosition = useRef(new Vector3().copy(camera.position))

    useFrame(() => {
      const currentCameraPosition = new Vector3().copy(camera.position)

      // Check if the camera has moved
      const isCameraMoving = !previousCameraPosition.current.equals(currentCameraPosition)

      if (isCameraMoving) {
        // Calculate the backward direction vector of the camera
        const backwardDirection = new Vector3()
        camera.getWorldDirection(backwardDirection)
        backwardDirection.negate().multiplyScalar(distanceBehind)

        // Calculate target position for the adventurer
        const targetPosition = currentCameraPosition.add(backwardDirection)
        targetPosition.y = 0

        // Smoothly move the adventurer towards the target position
        const adventurerPos = adventurerPosition.clone().lerp(targetPosition, followSpeed)
        setAdventurerPosition(adventurerPos)

        // Calculate rotation to face the camera
        const directionToCamera = new Vector3().subVectors(camera.position, adventurerPos)
        const rotationY = Math.atan2(directionToCamera.x, directionToCamera.z)
        setAdventurerRotation([0, rotationY, 0]) // Update the rotation state
      }

      // Update previous camera position
      previousCameraPosition.current.copy(currentCameraPosition)
    })

    return null
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
          <GLBAsset filePath="/2/RomanGuy.glb" scale={[4, 4, 4]} position={[3, 1.5, -39]} name="Barrel" message=""/>
          <GLBAsset filePath="/2/discus.glb" scale={[10, 10, 10]} position={[-42, 0, 4]} name="Barrel" message=""/>
          <GLBAsset filePath="/2/gladiator.glb" scale={[0.2, 0.2, 0.2]} position={[-6, 0, 10]} name="Barrel" message=""/>
          <GLBAsset filePath="/2/gladiator2.glb" scale={[0.8, 0.8, 0.8]} position={[-6, 5, -10]} name="Barrel" message=""/>
          <GLBAsset filePath="/2/Sphinx.glb" scale={[6, 6, 6]} position={[35, 7, -11]} rotation={[0, -Math.PI, 0]} name="Barrel" message=""/>
          
          {/* Adventurer following and looking at the player with rotation */}
          <GLBAsset 
            filePath="/2/Adventurer.glb" 
            scale={[2, 2, 2]} 
            position={adventurerPosition.toArray()} 
            rotation={adventurerRotation} // Pass updated rotation here
            name="Adventurer" 
            message=""
          />
          <AdventurerFollow />
        </Suspense>

        <FirstPersonCamera />

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
