import React, { useRef, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Html } from '@react-three/drei';
import '../css/GLBAsset.css'; // Import the CSS file

export default function GLBAsset({
  filePath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  message,
  name,
  interactable,
}) {
  const ref = useRef();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Toggle popup visibility on click
  const handleClick = () => {
    if (message) {
      setIsPopupVisible(!isPopupVisible);
    }
  };

  const gltf = useLoader(GLTFLoader, filePath);

  // Determine popup class based on 'interactable' prop
  const popupHeightClass = interactable ? 'large-popup' : 'small-popup';

  return (
    <group ref={ref} position={position} rotation={rotation} onClick={handleClick}>
      <primitive object={gltf.scene} scale={scale} />
      {isPopupVisible && message && (
        <Html position={[0, 3, 0]} center>
          <div className={`popup-container ${popupHeightClass}`}>
            {/* Title Section */}
            <div className="popup-title">{name}</div>
            {/* Message Content */}
            <p className="popup-message">{message}</p>
            {/* Action Buttons */}
            {interactable && (
              <div className="popup-actions">
                <button className="popup-extra-button">Recite me a poem!</button>
                <button className="popup-extra-button">Tell me a joke!</button>
                <button className="popup-extra-button">More Examples</button>
              </div>
            )}
            {/* Close Button */}
            <button className="close-button" onClick={() => setIsPopupVisible(false)}>
              ×
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}