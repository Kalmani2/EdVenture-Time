import React, { Suspense, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Html } from '@react-three/drei'
import { AxesHelper, GridHelper, Raycaster, Vector3 } from 'three'
import FirstPersonCamera from '../FirstPersonCamera'
import FloorWithEXRTexture from '../FloorWithEXRTexture'
import GLBAsset from '../GLBAsset'
import AssetQuiz from '../AssetQuiz'
import GLBAssetQuizable from '../GLBAssetQuizable'

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
          position: [6, 3, 40],
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
          <GLBAsset filePath="/1/TortureDevice.glb" scale={[1, 1, 1]} position={[17, 0, 6]} name="Gibbet" message="The gibbet was a medieval device used for displaying the bodies of executed criminals as a public warning. It typically consisted of a metal cage or chains in which the body was suspended, often left to decay in open air. This form of post-mortem punishment served to deter crime by showcasing the consequences of criminal acts in a very visible and gruesome way."/>
          <GLBAsset filePath="/1/Barrel.glb" scale={[0.6, 0.6, 0.6]} position={[-5, -0.2, -10]} name="Barrell" message="I am a barrell"/>
          <GLBAsset filePath="/1/Castle.glb" scale={[20, 20, 20]} position={[6, 0, 0]} />
          <AssetQuiz filePath="/1/Catapult.glb" scale={[1, 1, 1]} position={[20, 0, 35]} jsonFile="../../1/medieval.json" name="weaponry"/>
          <GLBAsset filePath="/1/IronChair.glb" scale={[1.6, 1.6, 1.6]} position={[17, 0, 0]} rotation={[0, -Math.PI / 2, 0]} name="Iron Chair" message="
The iron chair, also known as the 'Chair of Torture,' was a medieval torture device used primarily in Europe. It featured sharp spikes on the seat, backrest, and armrests, designed to inflict severe pain without causing immediate death. Victims would be strapped down, pressing their bodies into the spikes, often leading to prolonged agony before further interrogation or punishment."/> 
          <GLBAsset filePath="/1/Guillotine.glb" scale={[1.6, 1.6, 1.6]} position={[16, 0, 10]} rotation={[0, -Math.PI / 2, 0]} name="Guillotine" message="The guillotine was a device used primarily during the French Revolution for executions, designed to deliver a swift, humane death by beheading. Its structure included a tall wooden frame with a heavy, angled blade that would drop onto the neck of the condemned, severing it instantly. The guillotine became infamous not only for its efficiency but also as a symbol of revolutionary justice and the era’s turbulent social upheaval."/>
          <GLBAsset filePath="/1/Throne.glb" scale={[1, 1, 1]} position={[6, 2, -11]} rotation={[0, -Math.PI / 2, 0]} name="Throne"/>
          <GLBAssetQuizable filePath="/1/Knight.glb" scale={[0.3, 0.3, 0.3]} position={[4, 0, 11]} name="Knight" message="Greetings, traveler! The realm is full of perils, but bravery leads to glory. Stay vigilant, and may fortune favor your quest." interactable={true}/>
          <GLBAssetQuizable filePath="/1/King.glb" scale={[2.2, 2.2, 2.2]} position={[6, 0, -9]} name="King" message="Welcome to the throne room, noble visitor. I am the king of this realm. What brings you to my court?" interactable={true}/>
          {/* banners */}
          <GLBAsset filePath="/1/Banner.glb" scale={[1.5, 1.5, 1.5]} position={[-8.5, 8, 0]} rotation={[0, Math.PI/2, 0]} name="Banner"/>
          <GLBAsset filePath="/1/Banner.glb" scale={[1.5, 1.5, 1.5]} position={[20.5, 8, 0]} rotation={[0, -Math.PI/2, 0]} name="Banner"/>
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

      {/* Crosshair UI */}
      <div style={crosshairStyle}></div>
    </div>
  )
}

// Crosshair styling
const crosshairStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30px',
  height: '30px',
  borderTop: '2px solid white',
  borderLeft: '2px solid white',
  pointerEvents: 'none',
  zIndex: 10,
}
