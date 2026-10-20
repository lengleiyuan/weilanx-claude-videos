import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SceneLabel, SourceNote} from './scenes';
import {GCaption, YearHeader} from '../../library/gilded/stage';
import {Dust3D, SteamEngine3D} from '../../library/three/props';
import {ThreeStage} from '../../library/three/ThreeStage';
import {G, GF, goldText} from '../../library/gilded/theme';
import {WATT_COAL_SAVING_PCT} from './timeline';

/**
 * ep52 蒸汽机镜头的 3D PoC：8.5 秒、1920×1080。
 * 3D 只负责机器和空间；年份、仪表、字幕、出处仍然用原来的 DOM 组件叠在上面。
 */
export const Engine3DClip: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const cam = {
    pos: [0.35 + Math.sin(t * 0.13) * 0.55, 2.35 + Math.sin(t * 0.09) * 0.06, 11.8] as [number, number, number],
    target: [0.35, 1.65, 0] as [number, number, number],
    fov: 37,
  };
  return (
    <AbsoluteFill style={{background: G.bg}}>
      <ThreeStage cam={cam} fogNear={8} fogFar={30}>
        <SteamEngine3D f={f} />
        <Dust3D f={f} />
      </ThreeStage>

      <AbsoluteFill style={{background: 'radial-gradient(ellipse 65% 60% at 50% 46%, rgba(214,180,106,0.07), rgba(0,0,0,0) 62%), radial-gradient(ellipse 95% 90% at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.82) 100%)', pointerEvents: 'none'}} />

      <YearHeader f={f} at={0} year="1776" caption="伯明翰 · 詹姆斯·瓦特" />
      <SceneLabel f={f} at={0} text="THE STEAM ENGINE · 3D" sub="同样的功，三分之一的煤" x={1420} y={40} />

      <div style={{position: 'absolute', left: 760, top: 58, width: 400, textAlign: 'center', opacity: Math.min(1, f / 18)}}>
        <div style={{fontFamily: GF.cn, fontSize: 18, letterSpacing: 6, color: G.ivoryDim}}>每马力小时耗煤</div>
        <div style={{fontFamily: GF.num, fontSize: 96, lineHeight: 1.05, ...goldText(0.7)}}>−{WATT_COAL_SAVING_PCT}<span style={{fontSize: 44}}>%</span></div>
        <div style={{position: 'relative', width: 240, height: 7, background: 'rgba(239,230,210,0.12)', margin: '8px auto 0'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${34 * Math.min(1, f / 30)}%`, background: G.goldBright, boxShadow: `0 0 16px ${G.gold}`}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', width: 240, margin: '8px auto 0', fontFamily: GF.num, fontSize: 13, color: G.ivoryFaint}}>
          <span>33</span>
          <span>100</span>
        </div>
      </div>

      <GCaption f={f} at={8} out={240} text="瓦特的新蒸汽机，省煤三分之二。" en="Watt’s engine burned a third of the coal." y={940} size={46} />
      <SourceNote>3D PoC：程序化几何 + ThreeCanvas；机器是示意，不是工程复原。</SourceNote>
    </AbsoluteFill>
  );
};
