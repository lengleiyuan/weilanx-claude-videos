import React from 'react';
import {AbsoluteFill} from 'remotion';
import {rand} from '../../library/anim';
import {Dust, GildedBg, Grain} from '../../library/gilded/stage';
import {G, GF, goldText} from '../../library/gilded/theme';

/**
 * ep52 的 3:4 竖版封面（1080×1440）。抖音/视频号用。
 * 构图：上方标题，中央一条上升的金线和「×10」，下方一句钩子问题。
 */
export const Ep52CoverTall: React.FC = () => {
  const f = 40;
  const lumps = Array.from({length: 12}, (_, i) => {
    const x = 260 + (i % 4) * 150 + rand(i) * 30;
    const y = 990 + Math.floor(i / 4) * 62 + rand(i + 5) * 18;
    const r = 40 + rand(i + 9) * 26;
    const pts = Array.from({length: 7}, (_, j) => {
      const a = (j / 7) * Math.PI * 2;
      return `${x + Math.cos(a) * r},${y + Math.sin(a) * r * 0.62}`;
    }).join(' ');
    return {pts, i};
  });
  return (
    <AbsoluteFill style={{background: G.bg}}>
      <GildedBg f={f} glow={[50, 42]} strength={1.25} />
      <Dust f={f} n={40} w={1080} h={1440} />
      <div style={{position: 'absolute', left: 72, top: 76, fontFamily: GF.latin, fontSize: 18, letterSpacing: 8, color: G.ivoryFaint}}>WEILANX · EP52 · 暗金文献风</div>
      <div style={{position: 'absolute', left: 72, top: 120, width: 120, height: 1, background: G.goldLine}} />

      <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center'}}>
        <div style={{fontFamily: GF.cn, fontWeight: 900, fontSize: 176, letterSpacing: 14, lineHeight: 1, ...goldText(1.1)}}>越省越多</div>
        <div style={{fontFamily: GF.cn, fontSize: 46, letterSpacing: 16, color: G.ivory, marginTop: 34}}>杰文斯悖论</div>
        <div style={{fontFamily: GF.latin, fontSize: 20, letterSpacing: 10, color: G.ivoryDim, marginTop: 14}}>THE JEVONS PARADOX</div>
      </div>

      <svg width={1080} height={1440} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="cover-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f3dca0" stopOpacity={0.22} />
            <stop offset="1" stopColor="#d6b46a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={540} cy={980} rx={420} ry={260} fill="url(#cover-glow)" />
        <path d="M150 1120 C250 1110 330 1080 420 1010 C520 930 590 840 680 720 C760 616 830 540 930 470" fill="none" stroke={G.goldBright} strokeWidth={3} style={{filter: `drop-shadow(0 0 12px ${G.gold})`}} />
        <circle cx={930} cy={470} r={9} fill={G.goldBright} style={{filter: `drop-shadow(0 0 20px ${G.goldBright})`}} />
        <text x={120} y={700} fontFamily={GF.num} fontSize={180} fill={G.goldBright} opacity={0.95} style={{filter: 'drop-shadow(0 0 30px rgba(214,180,106,0.35))'}}>×10</text>
        <text x={250} y={770} fontFamily={GF.cn} fontSize={24} letterSpacing={10} fill={G.ivoryDim}>总 账 单</text>
        {lumps.map(({pts, i}) => <polygon key={i} points={pts} fill="rgba(18,14,9,0.96)" stroke={G.goldDeep} strokeWidth={1.2} />)}
      </svg>

      <div style={{position: 'absolute', left: 72, right: 72, top: 1210, textAlign: 'center'}}>
        <div style={{fontFamily: GF.cn, fontSize: 40, lineHeight: 1.5, color: G.ivory, letterSpacing: 2}}>为什么效率越高，<br />我们反而越忙？</div>
        <div style={{fontFamily: GF.cn, fontSize: 18, letterSpacing: 4, color: G.ivoryFaint, marginTop: 26}}>1865 → 2025 · 从煤到 AI 的同一个怪圈</div>
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 60, height: 1, background: `linear-gradient(90deg, rgba(214,180,106,0), ${G.goldLine}, rgba(214,180,106,0))`}} />
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
