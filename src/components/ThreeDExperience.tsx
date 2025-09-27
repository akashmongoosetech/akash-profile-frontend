import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Sparkles, Text3D } from '@react-three/drei';

function AnimatedTorusKnot() {
  const ref = useRef<any>();
  useFrame((state) => {
    ref.current.rotation.y += 0.012;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.18;
  });
  return (
    <Float floatIntensity={1.8} speed={1.7}>
      <mesh ref={ref} castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.4, 128, 32]} />
        <meshStandardMaterial color="orange" metalness={0.7} roughness={0.25} />
      </mesh>
    </Float>
  );
}

const ThreeDExperience: React.FC = () => (
  <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ height: '100vh', width: '100vw' }} shadows>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
    <pointLight position={[-10, -10, -10]} color="orange" intensity={0.5} />
    <Sparkles count={70} scale={8} size={4} color="white" />
    <AnimatedTorusKnot />
    {/* Requires /fonts/helvetiker_regular.typeface.json in public folder */}
    <Text3D
      position={[-3, 3, 0]}
      font="/fonts/helvetiker_regular.typeface.json"
      size={0.6}
      height={0.18}
      bevelEnabled
      bevelThickness={0.04}
      bevelSize={0.025}
      bevelOffset={0}
      bevelSegments={4}
    >
      Experience
      <meshStandardMaterial color="orange" />
    </Text3D>
    <Html position={[0, -2.5, 0]} center>
      <h2 style={{ color: 'white', fontSize: '1.5rem' }}>Experience</h2>
      <p style={{ color: 'white' }}>This is my 3D Experience page!</p>
    </Html>
    <OrbitControls />
  </Canvas>
);

export default ThreeDExperience; 