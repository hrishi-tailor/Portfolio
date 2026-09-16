import { memo } from "react";
import { Text, Billboard, RoundedBox } from "@react-three/drei";

export type SignData = {
  id: string;
  label: string;
  position: [number, number, number];
  rotationY?: number;
  accent?: string;
};

export default memo(function Sign({ data, active }: { data: SignData; active: boolean }) {
  const accent = data.accent ?? "#3ddc84";

  return (
    <group position={data.position}>
      {/* 1. Manicured Putting Green Collar & Green Turf */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
        <circleGeometry args={[2.5, 28]} />
        <meshStandardMaterial color="#388832" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]} receiveShadow>
        <circleGeometry args={[2.0, 28]} />
        <meshStandardMaterial color={active ? "#52b846" : "#449e39"} roughness={0.85} />
      </mesh>

      {/* 2. Golf Hole Cup & White Plastic Liner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <circleGeometry args={[0.22, 20]} />
        <meshStandardMaterial color="#141816" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0]}>
        <ringGeometry args={[0.2, 0.25, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* 3. Tall Golf Pin Flagpole */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2.2, 8]} />
        <meshStandardMaterial color="#f0eee8" roughness={0.4} />
      </mesh>
      {/* Striped Pin Bands */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.15, 8]} />
        <meshStandardMaterial color="#1a1d1e" />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.15, 8]} />
        <meshStandardMaterial color="#1a1d1e" />
      </mesh>

      {/* 4. Golf Flag Pennant */}
      <RoundedBox
        args={[0.48, 0.32, 0.025]}
        radius={0.015}
        position={[0.26, 1.95, 0]}
        castShadow
      >
        <meshStandardMaterial color={active ? accent : "#ff4d4d"} roughness={0.6} />
      </RoundedBox>

      {/* 5. Billboard Label Marker Above Hole (Faces camera at all times) */}
      <Billboard position={[0, 2.45, 0]}>
        <RoundedBox args={[2.2, 0.62, 0.1]} radius={0.06} castShadow>
          <meshStandardMaterial color={active ? accent : "#f4f1ea"} roughness={0.4} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.065]}
          fontSize={0.22}
          color={active ? "#0a0d0b" : "#1c1e1c"}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.1}
          fontWeight="bold"
        >
          {data.label}
        </Text>
      </Billboard>

      {/* 6. Active Pulsing Ground Ring */}
      {active && (
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.85, 24]} />
          <meshBasicMaterial color={accent} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
});
