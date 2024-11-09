// MedievalScene.js
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { Environment, OrbitControls, Sphere } from '@react-three/drei';
import { AxesHelper, GridHelper } from 'three';
import FloorWithEXRTexture from './FloorWithEXRTexture';
import GLBAsset from '../GLBAsset';

function VRSetup() {
  const { gl } = useThree();
  useEffect(() => {
    gl.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(gl));
  }, [gl]);
  return null;
}

function ReflectiveSphere() {
  return (
    <Sphere args={[1, 128, 128]} position={[0, 1, -2]}>
      <meshStandardMaterial metalness={1} roughness={0} />
    </Sphere>
  );
}

export default function MedievalScene() {
  const [dialogueData, setDialogueData] = useState(null);

  const handleNPCClick = (message, position) => {
    setDialogueData({ message, position: [position[0], position[1] + 1.5, position[2]] }); // Position the dialogue above the NPC
  };

  const closeDialogue = () => {
    setDialogueData(null); // Close dialogue when clicked outside
  };

  return (
    <div style={{ height: '100vh' }} onClick={closeDialogue}>
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
          <FloorWithEXRTexture />
          <GLBAsset filePath="/1/TortureDevice.glb" scale={[1, 1, 1]} position={[-4, 0, 0]} name="Gibbet" message=""/>
          <GLBAsset filePath="/1/Barrel.glb" scale={[1, 1, 1]} position={[-2, 0, 0]} name="Barrell" message="I am a barrell. gay"/>
          <GLBAsset filePath="/1/Castle.glb" scale={[20, 20, 20]} position={[6, 0, 0]} />
          <GLBAsset filePath="/1/Catapult.glb" scale={[0.1, 0.1, 0.1]} position={[20, 0, 0]} name="Catapult" message="This is a catapult"/>
          <GLBAsset filePath="/1/Knight.glb" scale={[0.1, 0.1, 0.1]} position={[0, 0, 0]} name="Knight" message="I am a knight " interactable={true}/>
        </Suspense>
      </Canvas>
    </div>
  );
}
