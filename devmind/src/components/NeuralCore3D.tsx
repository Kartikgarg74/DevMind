import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <Sphere
      ref={meshRef}
      args={[1, 32, 32]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <MeshDistortMaterial
        color="#00FFF7"
        speed={2}
        distort={hovered ? 0.4 : 0.2}
        radius={1}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
}

function Particles({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  useEffect(() => {
    if (mesh.current) {
      const temp = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        temp.position.set(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25
        );
        temp.updateMatrix();
        mesh.current.setMatrixAt(i, temp.matrix);
      }
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#7F5CFF" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function NeuralConnections() {
  const groupRef = useRef<THREE.Group>(null);
  const [connections, setConnections] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    const newConnections = Array.from({ length: 20 }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
    );
    setConnections(newConnections);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {connections.map((pos, index) => (
        <mesh key={index} position={pos}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#00FF85" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export default function NeuralCore3D() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed top-4 right-4 w-64 h-64 z-10 pointer-events-none"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00FFF7" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7F5CFF" />

        <AnimatedSphere />
        <Particles count={150} />
        <NeuralConnections />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="text-center"
        >
          <div className="text-neonAqua text-sm font-mono mb-1">NEURAL CORE</div>
          <div className="text-textSecondary text-xs">AI Processing</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
