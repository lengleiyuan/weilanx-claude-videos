import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {ThreeDemo} from './library/three/ThreeDemo';
import {Engine3DClip} from './episodes/ep52-jevons/Engine3DClip';

/**
 * 只装 3D 实验 composition 的轻量入口。
 * 正式工程用 src/index.ts；这个入口用于快速渲染 3D PoC，避免加载其它期数里会联网拉 Google Fonts 的模块。
 */
const ThreeRoot: React.FC = () => (
  <>
    <Composition id="library-three" component={ThreeDemo} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="ep52-engine-3d" component={Engine3DClip} durationInFrames={255} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(ThreeRoot);
