import { Text, Billboard, RoundedBox } from "@react-three/drei";

export type SignData = {
  id: string;
  label: string;
  position: [number, number, number];
  rotationY?: number;
  accent?: string;
};

export default function Sign({ data, active }: { data: SignData; active: boolean }) {
  const accent = data.accent ?? "#3ddc84";

  return (
    <group position={data.position}>
      {/* post */}
      <RoundedBox args={[0.14, 1.5, 0.14]} radius={0.03} position={[0, 0.75, 0]} castShadow>
        <meshStandardMaterial color="#5c4a35" />
      </RoundedBox>
      {/* board — square, not triangular, faces the camera at all times */}
      <Billboard position={[0, 1.6, 0]}>
        <RoundedBox args={[2.1, 0.65, 0.12]} radius={0.06} castShadow>
          <meshStandardMaterial color={active ? accent : "#f4f1ea"} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.08]}
          fontSize={0.24}
          color={active ? "#0a0d0b" : "#1c1e1c"}
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {data.label}
        </Text>
      </Billboard>
      {/* ground marker ring once visited */}
      {active && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.62, 24]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
