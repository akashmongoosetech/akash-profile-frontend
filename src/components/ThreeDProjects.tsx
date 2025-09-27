import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Sparkles, Text3D } from '@react-three/drei';

function AnimatedDodecahedron() {
  const ref = useRef<any>();
  useFrame((state) => {
    ref.current.rotation.y += 0.01;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
  });
  return (
    <Float floatIntensity={1.7} speed={1.6}>
      <mesh ref={ref} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.5]} />
        <meshStandardMaterial color="deepskyblue" metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  );
}

const ThreeDProjects: React.FC = () => (
  <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ height: '100vh', width: '100vw' }} shadows>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
    <pointLight position={[-10, -10, -10]} color="deepskyblue" intensity={0.5} />
    <Sparkles count={60} scale={8} size={4} color="white" />
    <AnimatedDodecahedron />
    {/* Requires /fonts/helvetiker_regular.typeface.json in public folder */}
    <Text3D
      position={[-2.5, 3, 0]}
      font="/fonts/helvetiker_regular.typeface.json"
      size={0.6}
      height={0.18}
      bevelEnabled
      bevelThickness={0.04}
      bevelSize={0.025}
      bevelOffset={0}
      bevelSegments={4}
    >
      Projects
      <meshStandardMaterial color="deepskyblue" />
    </Text3D>
    <Html position={[0, -2.5, 0]} center>
      <h2 style={{ color: 'white', fontSize: '1.5rem' }}>Projects</h2>
      <p style={{ color: 'white' }}>This is my 3D Projects page!</p>
    </Html>
    <OrbitControls />
  </Canvas>
);

export default ThreeDProjects; 