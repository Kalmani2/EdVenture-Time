import React from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function GLBAsset({ filePath, scale = [1, 1, 1], position = [0, 0, 0] }) {
  const gltf = useLoader(GLTFLoader, filePath)

  return (
    <primitive object={gltf.scene} scale={scale} position={position} />
  )
}
