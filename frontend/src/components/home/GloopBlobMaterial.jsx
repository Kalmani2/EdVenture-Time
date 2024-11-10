// src/components/GloopBlobMaterial.js
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

const GloopBlobMaterial = shaderMaterial(
  { time: 0, envMapIntensity: 2.5, offset: 0.0, envMap: null }, // Reduced envMapIntensity for darker reflections
  `
    uniform float time;
    uniform float offset;
    varying vec3 vReflect;
    varying vec3 vNormal;

    void main() {
      vNormal = normalize(normal);
      vec3 pos = position;

      // Subtle, smoother "gloop" effect
      float offsetX = sin(pos.x * 4.0 + time * 1.0 + offset) * 0.08;
      float offsetY = sin(pos.y * 4.0 + time * 1.0 + offset) * 0.12;
      float offsetZ = sin(pos.z * 4.0 + time * 1.0 + offset) * 0.08;
      pos += normal * (offsetX + offsetY + offsetZ);

      // Smooth drifting movement
      pos.x += sin(time * 0.3) * 0.05;
      pos.z += cos(time * 0.3) * 0.05;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vReflect = reflect(normalize(mvPosition.xyz), vNormal);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  `
    uniform float envMapIntensity;
    uniform samplerCube envMap;
    varying vec3 vReflect;
    varying vec3 vNormal;

    void main() {
      // Dark base color with minimal reflection for a subtler effect
      vec3 baseColor = vec3(0.05, 0.05, 0.06);
      vec3 reflectedColor = textureCube(envMap, vReflect).rgb * envMapIntensity;

      // Enhanced Fresnel effect for glancing angles
      float fresnel = dot(normalize(vNormal), normalize(vec3(0.0, 0.0, 1.0)));
      fresnel = pow(1.0 - fresnel, 3.0);

      // Blend the dark base color and environment reflection with Fresnel influence
      vec3 color = mix(baseColor, reflectedColor, fresnel * 0.7);

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ GloopBlobMaterial })
export default GloopBlobMaterial
