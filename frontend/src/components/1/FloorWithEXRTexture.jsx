import React from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'

export default function FloorWithTexture({ texturePath = '/1/stone_tiles_02_diff_1k.jpg', size = [10, 10], repeat = [4, 4] }) {

  const texture = useLoader(TextureLoader, texturePath)
  
  texture.encoding = THREE.sRGBEncoding
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeat[0], repeat[1])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
