import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {G, GF, goldText} from '../gilded/theme';
import {Dust3D, SteamEngine3D} from './props';
import {T} from './theme';
import {ThreeStage} from './ThreeStage';

/**
 * 3D 舞台的 10 秒演示：一台低多边形瓦特蒸汽机，暖金三点光 + 雾 + Bloom。
 * 这个 composition 不参与成片，只用来验证 ThreeCanvas / 材质 / 灯光 / 后处理 / 渲染速度。
 */
export const ThreeDemo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const cam = {
    pos: [0.35 + Math.sin(t * 0.16) * 0.55, 2.35, 11.6 - t * 0.03] as [number, number, number],
    target: [0.35, 1.65, 0] as [number, number, number],
    fov: 37,
  };
  return (
    <AbsoluteFill style={{background: T.bg}}>
      <ThreeStage cam={cam} fogNear={8} fogFar={30}>
        <SteamEngine3D f={f} />
        <Dust3D f={f} />
      </ThreeStage>

      {/* 2D 暗角 + 暖色渐变：和暗金文献风的 DOM 层衔接 */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 65% 60% at 50% 46%, rgba(214,180,106,0.08), rgba(0,0,0,0) 62%), radial-gradient(ellipse 95% 90% at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.82) 100%)', pointerEvents: 'none'}} />

      <div style={{position: 'absolute', left: 56, top: 40, fontFamily: GF.latin, fontSize: 18, letterSpacing: 7, color: G.gold}}>THREE.JS · 3D STAGE</div>
      <div style={{position: 'absolute', left: 56, top: 74, width: 260, height: 1, background: G.goldLine}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: GF.cn, fontWeight: 900, fontSize: 54, letterSpacing: 10, ...goldText(0.8)}}>低多边形 · 暖金 · 体积光</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 186, textAlign: 'center', fontFamily: GF.latinItalic, fontSize: 21, color: G.ivoryDim, letterSpacing: 2}}>procedural geometry / no external model / frame-pure</div>

      <div style={{position: 'absolute', left: 56, bottom: 48, fontFamily: GF.cn, fontSize: 17, color: G.ivoryFaint, letterSpacing: 2}}>
        library-three · 1920×1080 · 30fps · ThreeCanvas + R3F
      </div>
      <div style={{position: 'absolute', right: 56, bottom: 48, fontFamily: GF.num, fontSize: 17, color: G.ivoryFaint, letterSpacing: 2}}>
        f {String(f).padStart(3, '0')} / 300
      </div>
    </AbsoluteFill>
  );
};
