import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Sparkles, Text3D } from '@react-three/drei';

function AnimatedBox() {
  const ref = useRef<any>();
  useFrame((state) => {
    ref.current.rotation.y += 0.01;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
  });
  return (
    <Float floatIntensity={2} speed={2}>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="royalblue" metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  );
}

const ThreeDHome: React.FC = () => (
  <Canvas style={{ height: '100vh', width: '100vw' }} camera={{ position: [0, 0, 8], fov: 60 }} shadows>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
    <pointLight position={[-10, -10, -10]} color="hotpink" intensity={0.5} />
    <Sparkles count={80} scale={8} size={4} color="white" />
    <AnimatedBox />
    {/* Requires /fonts/helvetiker_regular.typeface.json in public folder */}
    <Text3D
      position={[-3, 3, 0]}
      font="/fonts/helvetiker_regular.typeface.json"
      size={0.7}
      height={0.2}
      bevelEnabled
      bevelThickness={0.05}
      bevelSize={0.03}
      bevelOffset={0}
      bevelSegments={5}
    >
      Welcome!
      <meshStandardMaterial color="gold" />
    </Text3D>
    <Html position={[0, -2.5, 0]} center>
      <h1 style={{ color: 'white', fontSize: '2rem', textAlign: 'center', textShadow: '0 2px 8px #000' }}>
        Welcome to My 3D Website!
      </h1>
    </Html>
    <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
  </Canvas>
);

export default ThreeDHome; 