import React from 'react';
import {useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {CAM, T} from './theme';

export type CamSpec = {
  /** 相机位置（米） */
  pos: [number, number, number];
  /** 看向哪里 */
  target: [number, number, number];
  fov?: number;
};

/** 相机是帧的纯函数：位置和 lookAt 都直接写，不依赖 useFrame */
const CameraRig: React.FC<{cam: CamSpec}> = ({cam}) => {
  const {camera} = useThree();
  const p = camera as THREE.PerspectiveCamera;
  p.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
  p.fov = cam.fov ?? CAM.fov;
  p.near = CAM.near;
  p.far = CAM.far;
  p.lookAt(cam.target[0], cam.target[1], cam.target[2]);
  p.updateProjectionMatrix();
  p.updateMatrixWorld();
  return null;
};

/** 色彩管理：ACES + sRGB，和 DOM 里的金色字幕对齐 */
const RendererSettings: React.FC = () => {
  const {gl} = useThree();
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.15;
  gl.outputColorSpace = THREE.SRGBColorSpace;
  return null;
};

/**
 * 3D 舞台：ThreeCanvas + 暖金三点光 + 雾 + Bloom/Vignette/Noise。
 * 画面内容全部由 children（帧纯函数组件）决定；这个组件只管“怎么拍”。
 */
export const ThreeStage: React.FC<{
  cam: CamSpec;
  children: React.ReactNode;
  background?: string;
  fogNear?: number;
  fogFar?: number;
}> = ({cam, children, background = T.bg, fogNear = 7, fogFar = 34}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      dpr={1}
      style={{position: 'absolute', inset: 0, background}}
      gl={{antialias: true, alpha: true, powerPreference: 'high-performance'}}
      camera={{fov: cam.fov ?? CAM.fov, position: cam.pos, near: CAM.near, far: CAM.far}}
    >
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[T.fog, fogNear, fogFar]} />

      <RendererSettings />
      <CameraRig cam={cam} />

      <ambientLight intensity={0.22} color={T.gold} />
      <directionalLight position={[6, 9, 5]} intensity={2.8} color="#ffd9a0" />
      <pointLight position={[-6, 3, 4]} intensity={26} distance={24} decay={2} color={T.ember} />
      <spotLight position={[0, 9, 6]} angle={0.55} penumbra={1} intensity={34} distance={36} color={T.goldBright} />

      {children}

    </ThreeCanvas>
  );
};
