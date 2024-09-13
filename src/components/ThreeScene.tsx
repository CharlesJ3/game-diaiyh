import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Rings = () => {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const ring4Ref = useRef<THREE.Mesh>(null);
  const ring5Ref = useRef<THREE.Mesh>(null);
  const ring6Ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ringRef.current) ringRef.current.rotation.z += 0.01;
    if (ring2Ref.current) ring2Ref.current.rotation.z += 0.012;
    if (ring3Ref.current) ring3Ref.current.rotation.z += 0.01;
    if (ring4Ref.current) ring4Ref.current.rotation.z -= 0.015;
    if (ring5Ref.current) ring5Ref.current.rotation.z += 0.020;
    if (ring6Ref.current) ring6Ref.current.rotation.z += 0.025;
  });

  const material2 = new THREE.MeshPhysicalMaterial({
    clearcoat: 1,
    clearcoatRoughness: 1,
    reflectivity: 7,
  });

  return (
    <>
      <mesh ref={ringRef} position={[0, 0, -400]}>
        <torusGeometry args={[21, 12, 22, 75, 28]} />
        <primitive object={material2} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0, -400]}>
        <torusGeometry args={[33, 12, 17, 15, 28]} />
        <primitive object={material2} />
      </mesh>
      <mesh ref={ring3Ref} position={[0, 0, -400]}>
        <torusGeometry args={[33, 12, 17, 15, 28]} />
        <primitive object={material2} />
      </mesh>
      <mesh ref={ring4Ref} position={[0, 0, -410]}>
        <torusGeometry args={[15, 18, 22, 35, 18]} />
        <primitive object={material2} />
      </mesh>
      <mesh ref={ring5Ref} position={[0, 0, -420]}>
        <torusGeometry args={[23, 18, 17, 17, 18]} />
        <primitive object={material2} />
      </mesh>
      <mesh ref={ring6Ref} position={[0, 0, -420]}>
        <torusGeometry args={[23, 18, 17, 17, 18]} />
        <primitive object={material2} />
      </mesh>
    </>
  );
};

const ThreeScene: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ fov: 14, near: 1, far: 2500 }}
      >
        <directionalLight
          position={[100, 121, 21]}
          intensity={1}
          color={"#FF1501"}
        />
        <directionalLight
          position={[-100, -111, 21]}
          intensity={1}
          color={"#01E5FF"}
        />
        <Rings />
      </Canvas>
    </div>
  );
};

export default ThreeScene;