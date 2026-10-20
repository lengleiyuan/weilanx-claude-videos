import React, {useMemo} from 'react';
import * as THREE from 'three';
import {rand} from '../anim';
import {T} from './theme';

/**
 * 3D 道具：低多边形、程序化、无外部模型。
 * 所有动画都接 f（帧号），不接 useFrame；随机一律用 rand(seed)。
 */

export const GoldMat: React.FC<{roughness?: number; emissive?: number}> = ({roughness = 0.26, emissive = 0.12}) => (
  <meshStandardMaterial color={T.gold} metalness={0.9} roughness={roughness} emissive={T.gold} emissiveIntensity={emissive} />
);

export const DarkMat: React.FC<{roughness?: number}> = ({roughness = 0.48}) => <meshStandardMaterial color={T.metal} metalness={0.55} roughness={roughness} />;

export const EmberMat: React.FC = () => <meshStandardMaterial color={T.ember} emissive={T.ember} emissiveIntensity={2.6} toneMapped={false} />;

export const IvoryMat: React.FC = () => <meshStandardMaterial color={T.ivory} metalness={0.05} roughness={0.62} />;

/** 用 CanvasTexture 做的加法光晕，替代 ThreeCanvas 下不工作的 Bloom 后处理 */
export const GlowSprite: React.FC<{pos: [number, number, number]; color?: string; size?: number; o?: number}> = ({pos, color = T.ember, size = 2, o = 0.5}) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,220,160,0.65)');
      g.addColorStop(0.6, 'rgba(255,180,90,0.18)');
      g.addColorStop(1, 'rgba(255,150,60,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, []);
  return (
    <sprite position={pos} scale={[size, size, 1]}>
      <spriteMaterial map={tex} color={color} transparent opacity={o} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </sprite>
  );
};

/** 两点之间的圆柱杆：位置取中点，四元数把 +Y 转到 a→b */
export const Rod: React.FC<{a: [number, number, number]; b: [number, number, number]; r?: number; gold?: boolean}> = ({a, b, r = 0.045, gold = true}) => {
  const {mid, quat, len} = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const length = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    const m = va.clone().add(vb).multiplyScalar(0.5);
    return {mid: [m.x, m.y, m.z] as [number, number, number], quat: q, len: length};
  }, [a, b]);
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 10]} />
      {gold ? <GoldMat /> : <DarkMat />}
    </mesh>
  );
};

/** 蒸汽：共享一张柔光贴图，加法混合的 sprite，比球体更像雾 */
export const SteamPuffs: React.FC<{f: number}> = ({f}) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(64, 64, 1, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,248,232,0.8)');
      g.addColorStop(0.4, 'rgba(239,230,210,0.28)');
      g.addColorStop(1, 'rgba(239,230,210,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <group>
      {Array.from({length: 26}, (_, i) => {
        const fromChimney = i % 2 === 0;
        const base: [number, number, number] = fromChimney ? [-3.5, 2.6, 0] : [2.55, 2.5, 0];
        const t = ((f * 0.012 + i * 0.073) % 1 + 1) % 1;
        const a = rand(i + 920) * Math.PI * 2;
        const x = base[0] + Math.cos(a) * (0.15 + t * 0.45) + t * 0.18;
        const y = base[1] + t * 2.3;
        const z = base[2] + Math.sin(a) * (0.15 + t * 0.4);
        const sc = 0.75 + t * 1.6;
        return (
          <sprite key={i} position={[x, y, z]} scale={[sc, sc, 1]}>
            <spriteMaterial map={tex} color={T.ivory} transparent opacity={0.36 * (1 - t)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
        );
      })}
    </group>
  );
};

/** 低多边形煤块：二十面体 + 暗金属 + 金色棱线 */
export const CoalChunk: React.FC<{pos: [number, number, number]; r?: number; seed?: number; scaleY?: number}> = ({pos, r = 0.22, seed = 1, scaleY = 0.8}) => {
  const rot = useMemo<[number, number, number]>(() => [rand(seed) * 3, rand(seed + 1) * 3, rand(seed + 2) * 3], [seed]);
  return (
    <group position={pos} rotation={rot} scale={[1, scaleY, 1]}>
      <mesh>
        <icosahedronGeometry args={[r, 0]} />
        <meshStandardMaterial color="#0b0805" metalness={0.4} roughness={0.72} flatShading />
      </mesh>
      <mesh scale={1.015}>
        <icosahedronGeometry args={[r, 0]} />
        <meshBasicMaterial color={T.gold} wireframe transparent opacity={0.28} />
      </mesh>
    </group>
  );
};

/** 煤堆：一堆确定性的煤块 */
export const CoalPile: React.FC<{x?: number; z?: number; n?: number; seed?: number}> = ({x = -3.6, z = 0.9, n = 12, seed = 7}) => (
  <group>
    {Array.from({length: n}, (_, i) => {
      const a = rand(seed + i) * Math.PI * 2;
      const rr = Math.sqrt(rand(seed + i + 20)) * 0.75;
      return (
        <CoalChunk
          key={i}
          pos={[x + Math.cos(a) * rr, 0.12 + rand(seed + i + 30) * 0.42, z + Math.sin(a) * rr]}
          r={0.16 + rand(seed + i + 40) * 0.18}
          seed={seed + i * 5}
        />
      );
    })}
  </group>
);

/** 飞轮：外环 + 八根辐条 + 中心轴；用 f 控制旋转 */
export const Flywheel: React.FC<{f: number; pos: [number, number, number]; r?: number}> = ({f, pos, r = 0.95}) => {
  const rot = f * 0.09;
  return (
    <group position={pos} rotation={[0, 0, rot]}>
      <mesh>
        <torusGeometry args={[r, 0.075, 10, 48]} />
        <GoldMat roughness={0.22} emissive={0.18} />
      </mesh>
      <mesh>
        <torusGeometry args={[r - 0.18, 0.025, 8, 48]} />
        <GoldMat roughness={0.35} emissive={0.08} />
      </mesh>
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (r / 2 + 0.05), Math.sin(a) * (r / 2 + 0.05), 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[r, 0.045, 0.045]} />
            <GoldMat roughness={0.3} emissive={0.08} />
          </mesh>
        );
      })}
      <mesh>
        <cylinderGeometry args={[0.16, 0.16, 0.24, 18]} />
        <GoldMat roughness={0.25} emissive={0.2} />
      </mesh>
    </group>
  );
};

/**
 * 瓦特蒸汽机：锅炉 + A 型支架 + 横梁 + 汽缸 + 飞轮 + 连杆 + 煤堆 + 蒸汽。
 * 坐标单位约等于米；y 向上；整组摆在原点附近。
 */
export const SteamEngine3D: React.FC<{f: number}> = ({f}) => {
  const pivot: [number, number, number] = [0.4, 3.1, 0];
  const angle = Math.sin(f / 13) * 0.06;
  const beamEnd: [number, number, number] = [pivot[0] + Math.cos(angle) * 2.25, pivot[1] + Math.sin(angle) * 2.25, 0];
  const flyPos: [number, number, number] = [3.45, 1.35, 0.85];
  const crankA = f * 0.09;
  const crank: [number, number, number] = [flyPos[0] + Math.cos(crankA) * 0.78, flyPos[1] + Math.sin(crankA) * 0.78, flyPos[2]];
  const pistonTop: [number, number, number] = [2.55, 2.45, 0];
  const pistonBase: [number, number, number] = [2.55, 1.0, 0];

  return (
    <group>
      {/* 地面与金线 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color="#080604" metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <ringGeometry args={[3.15, 3.2, 64]} />
        <meshBasicMaterial color={T.gold} transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[4.6, 4.63, 64]} />
        <meshBasicMaterial color={T.gold} transparent opacity={0.12} />
      </mesh>

      {/* 锅炉：横置圆筒，前方火门，上方烟囱 */}
      <group position={[-2.9, 1.05, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.72, 0.72, 2.3, 24]} />
          <DarkMat roughness={0.42} />
        </mesh>
        {[-0.85, 0, 0.85].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.735, 0.045, 8, 24]} />
            <GoldMat roughness={0.3} emissive={0.12} />
          </mesh>
        ))}
        <mesh position={[-1.18, -0.24, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.3, 24]} />
          <EmberMat />
        </mesh>
        <mesh position={[-1.22, -0.24, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.31, 0.38, 24]} />
          <GoldMat roughness={0.3} />
        </mesh>
        <mesh position={[-0.6, 1.35, 0]}>
          <cylinderGeometry args={[0.2, 0.26, 2.2, 16]} />
          <DarkMat roughness={0.5} />
        </mesh>
        <mesh position={[-0.6, 2.46, 0]}>
          <cylinderGeometry args={[0.28, 0.24, 0.12, 16]} />
          <GoldMat roughness={0.35} emissive={0.12} />
        </mesh>
        {/* 压力表 */}
        <mesh position={[0.1, 0.15, 0.73]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.04, 20]} />
          <GoldMat roughness={0.3} emissive={0.18} />
        </mesh>
      </group>

      {/* A 型支架 */}
      <Rod a={[-1.15, 0, 0]} b={pivot} r={0.12} gold />
      <Rod a={[2.05, 0, 0]} b={pivot} r={0.12} gold />
      <Rod a={[-0.55, 1.2, 0]} b={[1.45, 1.2, 0]} r={0.04} gold />
      <Rod a={[-0.05, 2.0, 0]} b={[0.95, 2.0, 0]} r={0.035} gold />
      <mesh position={pivot}>
        <cylinderGeometry args={[0.2, 0.2, 0.24, 20]} />
        <GoldMat roughness={0.22} emissive={0.2} />
      </mesh>

      {/* 横梁 */}
      <group position={pivot} rotation={[0, 0, angle]}>
        <mesh>
          <boxGeometry args={[4.5, 0.2, 0.2]} />
          <GoldMat roughness={0.24} emissive={0.16} />
        </mesh>
        <mesh position={[-2.05, -0.28, 0]}>
          <boxGeometry args={[0.5, 0.55, 0.5]} />
          <GoldMat roughness={0.32} emissive={0.1} />
        </mesh>
        <Rod a={[2.25, 0, 0]} b={[2.25, -0.45, 0]} r={0.05} gold />
      </group>

      {/* 汽缸与活塞杆 */}
      <group position={[2.55, 1.55, 0]}>
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 1.5, 24]} />
          <DarkMat roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.37, 0.37, 0.1, 24]} />
          <GoldMat roughness={0.3} emissive={0.14} />
        </mesh>
        <mesh position={[0, -0.82, 0]}>
          <cylinderGeometry args={[0.37, 0.37, 0.1, 24]} />
          <GoldMat roughness={0.3} emissive={0.14} />
        </mesh>
      </group>
      <Rod a={beamEnd} b={pistonTop} r={0.055} gold />
      <Rod a={pistonTop} b={[2.55, 1.9, 0]} r={0.05} gold />
      <Rod a={pistonBase} b={[2.55, 0, 0]} r={0.09} gold={false} />

      {/* 飞轮与连杆 */}
      <Flywheel f={f} pos={flyPos} />
      <Rod a={beamEnd} b={crank} r={0.05} gold />
      <mesh position={crank}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <GoldMat roughness={0.2} emissive={0.24} />
      </mesh>

      <CoalPile x={-3.7} z={0.9} n={14} seed={11} />
      <GlowSprite pos={[-4.05, 0.82, 0.1]} color={T.ember} size={2.1} o={0.55} />
      <GlowSprite pos={[3.45, 1.35, 0.85]} color={T.goldBright} size={2.8} o={0.13} />

      <SteamPuffs f={f} />
      {/* 轴流 / 暖光 */}
      <pointLight position={[-4.2, 1.0, 1.4]} color={T.ember} intensity={7} distance={8} decay={2} />
      <pointLight position={[3.6, 1.6, 1.8]} color={T.goldBright} intensity={6} distance={8} decay={2} />
    </group>
  );
};

/** 3D 浮尘：确定性的点云，缓慢上浮 */
export const Dust3D: React.FC<{f: number; n?: number}> = ({f, n = 240}) => {
  const positions = useMemo(() => {
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (rand(i + 90) - 0.5) * 14;
      arr[i * 3 + 1] = rand(i + 190) * 6;
      arr[i * 3 + 2] = (rand(i + 290) - 0.5) * 8;
    }
    return arr;
  }, [n]);
  return (
    <points position={[0, (f * 0.0015) % 1, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={T.goldBright} size={0.035} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
};
