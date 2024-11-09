import React, { useRef, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Html } from '@react-three/drei';

export default function AssetQuiz({
  filePath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  jsonFile,
  name
}) {
  const ref = useRef();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleClick = () => {
    if (message) {
      setIsPopupVisible(!isPopupVisible);
    }
  };

  const gltf = useLoader(GLTFLoader, filePath);

  return (
    <group ref={ref} position={position} onClick={handleClick}>
      <primitive object={gltf.scene} scale={scale} />
      {isPopupVisible && message && (
        <Html position={[0, 3, 0]} center>
          
        </Html>
      )}
    </group>
  );
}