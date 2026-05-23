import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, OrbitControls, Stars, Torus } from "@react-three/drei";


function Knot() {
  const ref = useRef(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.2;
    ref.current.rotation.y += dt * 0.15;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} scale={1.4}>
        <torusKnotGeometry args={[1, 0.32, 220, 32]} />
        <MeshDistortMaterial color="#22d3ee" emissive="#0ea5b7" emissiveIntensity={0.6} distort={0.35} speed={1.6} roughness={0.15} metalness={0.7} />
      </mesh>
    </Float>
  );
}

function FloatingObjects() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Icosahedron args={[0.6, 0]} position={[-3.2, 1.4, -1]}>
          <meshStandardMaterial color="#a855f7" emissive="#7c3aed" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
        </Icosahedron>
      </Float>
      <Float speed={1.6} rotationIntensity={1.4} floatIntensity={1.6}>
        <Torus args={[0.7, 0.18, 24, 80]} position={[3, -1.2, -1]}>
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.6} roughness={0.2} metalness={0.9} />
        </Torus>
      </Float>
      <Float speed={2.4} rotationIntensity={0.8} floatIntensity={2}>
        <mesh position={[2.4, 1.6, -2]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.4} roughness={0.3} metalness={0.7} />
        </mesh>
      </Float>
    </>
  );
}



export function Scene3D({ interactive = false, showStars = true, intense = false }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#22d3ee" />
      <pointLight position={[-5, -3, -2]} intensity={1} color="#a855f7" />
      <directionalLight position={[0, 5, 3]} intensity={0.6} />
      <Suspense fallback={null}>
        {showStars && <Stars radius={60} depth={40} count={intense ? 4000 : 2000} factor={3} fade speed={1} />}
        <Knot />
        <FloatingObjects />
      </Suspense>
      {interactive && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />}
    </Canvas>
  );
}
