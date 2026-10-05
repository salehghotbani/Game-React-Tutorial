import { ARCADE_POSITION } from '../interaction/interaction';

export function ArcadeMachine() {
  return (
    <group position={ARCADE_POSITION} rotation={[0, -0.3, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow><boxGeometry args={[0.95, 1.4, 0.88]} /><meshStandardMaterial color="#3b5b50" /></mesh>
      <mesh position={[0, 1.75, -0.15]} castShadow><boxGeometry args={[0.98, 1.02, 0.58]} /><meshStandardMaterial color="#273e39" /></mesh>
      <mesh position={[0, 1.82, 0.151]}><planeGeometry args={[0.76, 0.66]} /><meshStandardMaterial color="#234956" emissive="#40786c" emissiveIntensity={0.7} /></mesh>
      <mesh position={[0, 2.34, -0.15]} castShadow><boxGeometry args={[1.04, 0.25, 0.68]} /><meshStandardMaterial color="#d0ad64" emissive="#d0ad64" emissiveIntensity={0.15} /></mesh>
      <mesh position={[0, 1.28, 0.3]} rotation={[-0.16, 0, 0]} castShadow><boxGeometry args={[1.06, 0.15, 0.7]} /><meshStandardMaterial color="#d0ad64" /></mesh>
      <mesh position={[-0.23, 1.47, 0.42]}><sphereGeometry args={[0.06, 12, 8]} /><meshStandardMaterial color="#c97157" /></mesh>
      <mesh position={[0.17, 1.39, 0.48]}><cylinderGeometry args={[0.055, 0.055, 0.04, 12]} /><meshStandardMaterial color="#c97157" /></mesh>
      <mesh position={[0.33, 1.39, 0.48]}><cylinderGeometry args={[0.055, 0.055, 0.04, 12]} /><meshStandardMaterial color="#709fa1" /></mesh>
      {[-0.2, 0.2].map((x) => <mesh key={x} position={[x, 1.84, 0.17]}><boxGeometry args={[0.13, 0.16, 0.02]} /><meshStandardMaterial color="#b5d194" emissive="#a0cc80" emissiveIntensity={0.8} /></mesh>)}
      <pointLight position={[0, 1.9, 0.5]} color="#88c9a4" intensity={0.8} distance={2} />
    </group>
  );
}
