import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, Stars, OrbitControls } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "./Section";
import * as THREE from "three";

// 1. Procedural 3D tech representation meshes
function ReactIcon({ hovered }) {
  const groupRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#61DAFB" emissive="#61DAFB" emissiveIntensity={hovered ? 1.5 : 0.4} roughness={0.1} />
      </mesh>
      {/* Orbit Ring 1 */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.7, 0.04, 8, 48]} />
        <meshBasicMaterial color="#61DAFB" transparent opacity={0.6} />
      </mesh>
      {/* Orbit Ring 2 */}
      <mesh rotation={[0, Math.PI / 2, Math.PI / 4]}>
        <torusGeometry args={[0.7, 0.04, 8, 48]} />
        <meshBasicMaterial color="#61DAFB" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function NodeIcon({ hovered }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Hexagonal Prism */}
      <cylinderGeometry args={[0.42, 0.42, 0.6, 6]} />
      <meshStandardMaterial
        color="#339933"
        emissive="#339933"
        emissiveIntensity={hovered ? 1.4 : 0.3}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}

function ExpressIcon({ hovered }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.3;
      meshRef.current.rotation.z = t * 0.25;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Glass Cube */}
      <mesh>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.8}
          opacity={1}
          transparent
          roughness={0.1}
          metalness={0.1}
          ior={1.5}
          thickness={0.5}
        />
      </mesh>
      {/* Inner Emissive Core */}
      <mesh>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={hovered ? 2 : 0.5}
        />
      </mesh>
    </group>
  );
}

function MongoIcon({ hovered }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.6;
    }
  });

  return (
    <mesh ref={meshRef} scale={[0.5, 0.9, 0.5]}>
      {/* Double Cone representing leaf */}
      <octahedronGeometry args={[0.5]} />
      <meshStandardMaterial
        color="#47A248"
        emissive="#47A248"
        emissiveIntensity={hovered ? 1.5 : 0.3}
        roughness={0.2}
        metalness={0.7}
      />
    </mesh>
  );
}

function JSIcon({ hovered }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.5;
      meshRef.current.rotation.z = Math.cos(t * 0.4) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Plate */}
      <boxGeometry args={[0.75, 0.75, 0.08]} />
      <meshStandardMaterial
        color="#F7DF1E"
        emissive="#F7DF1E"
        emissiveIntensity={hovered ? 1.2 : 0.2}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

function TailwindIcon({ hovered }) {
  const groupRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wave shape 1 */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.5, 0.08, 8, 32, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={hovered ? 1.5 : 0.4}
        />
      </mesh>
      {/* Wave shape 2 */}
      <mesh rotation={[-Math.PI / 4, 0, Math.PI]}>
        <torusGeometry args={[0.5, 0.08, 8, 32, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={hovered ? 1.5 : 0.4}
        />
      </mesh>
    </group>
  );
}

function GitHubIcon({ hovered }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.x = Math.cos(t * 0.4) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.45, 32, 32]} />
      <meshStandardMaterial
        color="#181717"
        emissive="#ffffff"
        emissiveIntensity={hovered ? 0.9 : 0.15}
        roughness={0.2}
        metalness={0.9}
      />
    </mesh>
  );
}

function FirebaseIcon({ hovered }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Tetrahedron (Three-sided pyramid) */}
      <coneGeometry args={[0.5, 0.8, 3]} />
      <meshStandardMaterial
        color="#FFCA28"
        emissive="#FFCA28"
        emissiveIntensity={hovered ? 1.6 : 0.3}
        roughness={0.1}
        metalness={0.6}
      />
    </mesh>
  );
}

// 2. Mouse follower light
function MouseLight() {
  const lightRef = useRef();
  useFrame((state) => {
    if (lightRef.current) {
      const { x, y } = state.pointer;
      // Map screen [-1, 1] to 3D coords
      lightRef.current.position.x = x * 6;
      lightRef.current.position.y = y * 4;
    }
  });
  return <pointLight ref={lightRef} distance={8} intensity={2} color="#ffffff" />;
}

// 3. Main floating node item wrapper
function UniverseNode({ tech, position, index, setHoveredTech }) {
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredTech(tech.name);
  };

  const handlePointerOut = () => {
    setHovered(false);
    setHoveredTech("");
  };

  return (
    <Float
      speed={1.5 + index * 0.2}
      rotationIntensity={0.6}
      floatIntensity={1.2}
      position={position}
    >
      <group
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={hovered ? 1.35 : 1}
      >
        {/* Render respective icons */}
        {tech.name === "React" && <ReactIcon hovered={hovered} />}
        {tech.name === "Node.js" && <NodeIcon hovered={hovered} />}
        {tech.name === "Express.js" && <ExpressIcon hovered={hovered} />}
        {tech.name === "MongoDB" && <MongoIcon hovered={hovered} />}
        {tech.name === "JavaScript" && <JSIcon hovered={hovered} />}
        {tech.name === "Tailwind CSS" && <TailwindIcon hovered={hovered} />}
        {tech.name === "GitHub" && <GitHubIcon hovered={hovered} />}
        {tech.name === "Firebase" && <FirebaseIcon hovered={hovered} />}

        {/* Orbit light rings when hovered */}
        {hovered && (
          <pointLight color={tech.color} intensity={2.5} distance={3} />
        )}
      </group>
    </Float>
  );
}

// Tech stack config
const TECHS = [
  { name: "React", color: "#61DAFB", position: [-3, 1.5, 0] },
  { name: "Node.js", color: "#339933", position: [-1, 1.8, -1] },
  { name: "Express.js", color: "#ffffff", position: [1, 1.6, -0.5] },
  { name: "MongoDB", color: "#47A248", position: [3, 1.5, 0] },
  { name: "JavaScript", color: "#F7DF1E", position: [-3, -1.2, 0.5] },
  { name: "Tailwind CSS", color: "#06B6D4", position: [-0.8, -1.5, -0.5] },
  { name: "GitHub", color: "#ffffff", position: [1.2, -1.4, -1] },
  { name: "Firebase", color: "#FFCA28", position: [3, -1.3, 0.5] },
];

export function TechStackUniverse() {
  const [hoveredTech, setHoveredTech] = useState("");

  return (
    <Section
      id="services" // link to navbar section (representing tech and services)
      eyebrow="tech universe"
      title={<>The <span className="text-gradient">Tech Stack</span> Universe</>}
      description="An interactive 3D playground showcasing the core technologies I build MERN applications with."
    >
      <div className="relative w-full h-[550px] rounded-3xl overflow-hidden glass-strong neon-border bg-black/30">
        
        {/* Neon HUD overlay */}
        <div className="absolute top-4 left-6 z-10 pointer-events-none font-mono text-xs text-muted-foreground">
          // interact: hover icons & drag to rotate orbital camera
        </div>

        {/* Floating tech label */}
        <div className="absolute top-4 right-6 z-10 pointer-events-none font-mono text-right">
          <AnimatePresence>
            {hoveredTech ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-xl px-4 py-2 text-sm border-[var(--neon)]/40 shadow-neon"
                style={{
                  textShadow: `0 0 10px ${TECHS.find((t) => t.name === hoveredTech)?.color}88`,
                  color: TECHS.find((t) => t.name === hoveredTech)?.color,
                }}
              >
                SYSTEM_NODE: {hoveredTech.toUpperCase()}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                className="text-xs text-muted-foreground font-mono"
              >
                SYSTEM_STATUS: ORBITAL_ACTIVE
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.2} />
          <directionalLight position={[0, 4, 3]} intensity={1.5} />
          
          {/* Spotlight cast */}
          <spotLight
            position={[0, 10, 5]}
            angle={0.4}
            penumbra={1}
            intensity={1.5}
            color="#22d3ee"
            castShadow
          />

          {/* Core Star / Particle Background */}
          <Stars radius={50} depth={30} count={1200} factor={3} fade speed={1.2} />

          {/* Mouse reactive pointlight */}
          <MouseLight />

          {/* Orbital grid lines */}
          <gridHelper args={[20, 20, "#22d3ee", "#a855f7"]} position={[0, -2.5, 0]} opacity={0.15} transparent />

          {/* Render 3D nodes */}
          {TECHS.map((tech, idx) => (
            <UniverseNode
              key={tech.name}
              tech={tech}
              position={tech.position}
              index={idx}
              setHoveredTech={setHoveredTech}
            />
          ))}

          {/* Interactive controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>

        {/* Animated grid SVG overlay in the background */}
        <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none -z-10" />
      </div>
    </Section>
  );
}
