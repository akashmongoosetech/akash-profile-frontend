import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Text3D, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

const pages = [
  { path: '/', label: 'Home', color: 'royalblue', position: [-6, 0, 0] },
  { path: '/about', label: 'About', color: 'hotpink', position: [-3, 2, 0] },
  { path: '/experience', label: 'Experience', color: 'orange', position: [0, 3, 0] },
  { path: '/projects', label: 'Projects', color: 'deepskyblue', position: [3, 2, 0] },
  { path: '/skills', label: 'Skills', color: 'mediumseagreen', position: [6, 0, 0] },
  { path: '/services', label: 'Services', color: 'gold', position: [3, -2, 0] },
  { path: '/contact', label: 'Contact', color: 'crimson', position: [0, -3, 0] },
  { path: '/blog', label: 'Blog', color: 'rebeccapurple', position: [-3, -2, 0] },
  { path: '/testimonials', label: 'Testimonials', color: 'teal', position: [0, 0, 0] },
];

function NavSphere({ path, label, color, position }: any) {
  const meshRef = useRef<any>();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(hovered ? 1.25 : 1);
    }
  });
  return (
    <group position={position}>
      <Float floatIntensity={1.2} speed={1.2}>
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => navigate(path)}
          scale={hovered ? 1.25 : 1}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
        </mesh>
      </Float>
      <Text3D
        position={[0, -1.7, 0]}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.35}
        height={0.08}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={3}
      >
        {label}
        <meshStandardMaterial color={color} />
      </Text3D>
    </group>
  );
}

const ThreeDHub: React.FC = () => (
  <Canvas camera={{ position: [0, 0, 15], fov: 60 }} style={{ height: '100vh', width: '100vw' }} shadows>
    <ambientLight intensity={0.7} />
    <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
    <pointLight position={[-10, -10, -10]} color="white" intensity={0.7} />
    <Sparkles count={120} scale={16} size={6} color="white" />
    {pages.map((page, i) => (
      <NavSphere key={page.path} {...page} />
    ))}
    <Html position={[0, 6, 0]} center>
      <h1 style={{ color: 'white', fontSize: '2.2rem', textAlign: 'center', textShadow: '0 2px 8px #000' }}>
        3D Navigation Hub<br />Click a sphere to visit a page
      </h1>
    </Html>
    <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
  </Canvas>
);

export default ThreeDHub; 