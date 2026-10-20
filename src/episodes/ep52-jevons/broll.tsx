import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, rand} from '../../library/anim';
import {G, GF, goldText} from '../../library/gilded/theme';
import {fb, SHOTS} from './timeline';
import {vis} from './scenes';

/**
 * 5 分钟版后半段的“实拍感 B-roll 层”。
 * 不是外部素材，是用 SVG/DOM 做的低照度、浅景深、手持感的 plate；
 * 统一压成暗金/琥珀调，叠在图表和字卡后面，给后半段补一层“现场空气”。
 */

const Plate: React.FC<{f: number; o: number; bright?: number; children: React.ReactNode}> = ({f, o, bright = 1, children}) => {
  if (o <= 0) return null;
  const hx = Math.sin(f * 0.035) * 5 + Math.sin(f * 0.011) * 8;
  const hy = Math.cos(f * 0.028) * 4;
  return (
    <AbsoluteFill style={{opacity: o, filter: `contrast(1.1) saturate(0.95) brightness(${1.12 * bright})`}}>
      <AbsoluteFill style={{transform: `translate(${hx}px, ${hy}px) scale(1.03)`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 62% 58% at 50% 46%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.72) 100%)'}} />
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 1px, transparent 4px)', opacity: 0.35}} />
      <AbsoluteFill style={{background: 'linear-gradient(105deg, rgba(243,220,160,0.06), transparent 32%, transparent 70%, rgba(243,220,160,0.035))'}} />
    </AbsoluteFill>
  );
};

const OfficePrintPlate: React.FC<{f: number}> = ({f}) => {
  const at = fb(65);
  const p = clamp01((f - at) / 140);
  const sheets = 4 + Math.floor(p * 6);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #090806 0%, #17120b 52%, #060504 100%)'}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="office-lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f6e7bd" stopOpacity={0.55} />
            <stop offset="0.35" stopColor="#d6b46a" stopOpacity={0.18} />
            <stop offset="1" stopColor="#d6b46a" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="office-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#17120b" />
            <stop offset="1" stopColor="#050403" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#office-floor)" />
        {[460, 880, 1300].map((x, i) => (
          <g key={i}>
            <rect x={x} y={64} width={300} height={22} fill="#efe6d2" opacity={0.16} />
            <ellipse cx={x + 150} cy={90} rx={260} ry={150} fill="url(#office-lamp)" opacity={0.75} />
          </g>
        ))}
        <path d="M 0 760 L 1920 760 L 1920 1080 L 0 1080 Z" fill="#241c11" stroke="rgba(243,220,160,0.32)" />
        {Array.from({length: 11}, (_, i) => (
          <line key={i} x1={960 + (i - 5) * 210} y1={760} x2={960 + (i - 5) * 380} y2={1080} stroke="rgba(214,180,106,0.12)" strokeWidth={1} />
        ))}
        {/* 打印机 / 复印机 */}
        <g transform={`translate(${1070 - p * 30} 360)`}>
          <rect x={0} y={0} width={560} height={330} rx={4} fill="#12100c" stroke="rgba(214,180,106,0.38)" strokeWidth={2} />
          <rect x={30} y={30} width={310} height={70} fill="#070605" stroke="rgba(239,230,210,0.18)" />
          <rect x={360} y={46} width={150} height={40} fill="rgba(243,220,160,0.12)" stroke="rgba(243,220,160,0.4)" />
          <rect x={40} y={150} width={480} height={32} fill="#050403" />
          <rect x={70} y={200} width={420} height={96} fill="#0a0806" stroke="rgba(214,180,106,0.2)" />
          <rect x={90} y={212} width={380} height={8} fill="rgba(214,180,106,0.16)" />
          <circle cx={500} cy={250} r={7} fill={Math.sin(f * 0.09) > 0 ? G.goldBright : 'rgba(214,180,106,0.2)'} />
        </g>
        {/* 纸 */}
        {Array.from({length: sheets}, (_, i) => {
          const t = ((f * 0.012 + i * 0.11) % 1 + 1) % 1;
          const x = 760 + i * 26 - p * 30;
          const y = 650 - t * 300 + i * 8;
          return <rect key={i} x={x} y={y} width={250} height={18} fill="rgba(239,230,210,0.22)" stroke="rgba(214,180,106,0.35)" transform={`rotate(${-12 + i * 2} ${x} ${y})`} opacity={0.35 + 0.4 * (1 - t)} />;
        })}
        {/* 桌 / 椅 / 显示器剪影 */}
        <g opacity={0.75}>
          <rect x={190} y={620} width={620} height={22} fill="#0b0906" stroke="rgba(214,180,106,0.22)" />
          <rect x={230} y={642} width={22} height={220} fill="#080705" />
          <rect x={740} y={642} width={22} height={220} fill="#080705" />
          <rect x={300} y={470} width={270} height={150} fill="#050403" stroke="rgba(239,230,210,0.12)" />
          <rect x={318} y={488} width={234} height={114} fill="rgba(214,180,106,0.05)" />
          <circle cx={880} cy={600} r={54} fill="#080705" stroke="rgba(214,180,106,0.18)" />
          <rect x={856} y={640} width={48} height={150} fill="#080705" />
        </g>
        {/* 浅景深前景 */}
        {Array.from({length: 9}, (_, i) => (
          <circle key={i} cx={130 + rand(i + 20) * 1660} cy={720 + rand(i + 30) * 300} r={20 + rand(i + 40) * 60} fill="rgba(243,220,160,0.03)" stroke="rgba(243,220,160,0.05)" />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: 'rgba(243,220,160,0.18)', opacity: 0.45}} />
    </AbsoluteFill>
  );
};

const TollPlate: React.FC<{f: number}> = ({f}) => {
  const lanes = [-360, -180, 0, 180, 360];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #050608 0%, #0b0d12 46%, #030303 100%)'}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="toll-sodium" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffd79a" stopOpacity={0.55} />
            <stop offset="0.4" stopColor="#d6a45a" stopOpacity={0.18} />
            <stop offset="1" stopColor="#d6a45a" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="toll-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b0d12" />
            <stop offset="1" stopColor="#15120e" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#toll-road)" />
        {/* 雨夜天空 / 城市远光 */}
        {Array.from({length: 22}, (_, i) => (
          <ellipse key={i} cx={100 + i * 88} cy={140 + Math.sin(i) * 30} rx={18 + rand(i + 50) * 30} ry={4 + rand(i + 51) * 6} fill="#f3dca0" opacity={0.12 + rand(i + 52) * 0.18} />
        ))}
        {/* 收费雨棚 */}
        <rect x={120} y={120} width={1680} height={96} fill="#07080a" stroke="rgba(214,180,106,0.22)" />
        {[-260, -60, 140, 340].map((x, i) => (
          <g key={i}>
            <rect x={960 + x} y={220} width={16} height={330} fill="#07080a" />
            <ellipse cx={960 + x + 8} cy={250} rx={90} ry={70} fill="url(#toll-sodium)" opacity={0.8} />
            <rect x={960 + x - 10} y={238} width={36} height={12} fill="#ffe6b0" opacity={0.7} />
          </g>
        ))}
        {/* 路面 + 车道 */}
        <polygon points="80,1080 1840,1080 1260,440 660,440" fill="#0d0c0a" stroke="rgba(214,180,106,0.2)" />
        {lanes.map((x, i) => (
          <g key={i}>
            <line x1={960 + x * 0.62} y1={440} x2={960 + x * 1.55} y2={1080} stroke="rgba(239,230,210,0.22)" strokeWidth={2} strokeDasharray="24 28" />
          </g>
        ))}
        {/* 收费亭 / 栏杆 */}
        {[-300, -80, 140, 360].map((x, i) => (
          <g key={i} transform={`translate(${960 + x} 560)`}>
            <rect x={-55} y={-50} width={110} height={120} fill="#0a0907" stroke="rgba(214,180,106,0.35)" />
            <rect x={-38} y={-34} width={76} height={48} fill="rgba(243,220,160,0.08)" stroke="rgba(243,220,160,0.18)" />
            <rect x={-5} y={70} width={10} height={110} fill="#0a0907" />
            <line x1={-5} y1={80} x2={-5} y2={150} stroke={G.goldBright} strokeWidth={3} opacity={0.7} />
            <line x1={-80} y1={100} x2={i % 2 ? 80 : 70} y2={100} stroke="#f3dca0" strokeWidth={4} opacity={0.35 + 0.3 * (i % 2)} />
          </g>
        ))}
        {/* 车流 */}
        {Array.from({length: 14}, (_, i) => {
          const t = ((f * (0.0018 + rand(i + 60) * 0.0016) + rand(i + 61)) % 1 + 1) % 1;
          const y = 1010 - t * 520;
          const scale = 0.45 + t * 0.9;
          const x = 960 + lanes[i % lanes.length] * (0.55 + t * 0.8) + Math.sin(i) * 18;
          return (
            <g key={i} opacity={0.55 + 0.4 * (1 - t)}>
              <rect x={x - 34 * scale} y={y - 14 * scale} width={68 * scale} height={28 * scale} fill="#050505" stroke="rgba(239,230,210,0.18)" />
              <circle cx={x - 22 * scale} cy={y + 12 * scale} r={4 * scale} fill="#ffd79a" />
              <circle cx={x + 22 * scale} cy={y + 12 * scale} r={4 * scale} fill="#ffd79a" />
              <rect x={x - 16 * scale} y={y - 24 * scale} width={32 * scale} height={10 * scale} fill="rgba(243,220,160,0.12)" />
            </g>
          );
        })}
        {/* 湿地反光 */}
        {Array.from({length: 18}, (_, i) => (
          <rect key={i} x={600 + rand(i + 70) * 720} y={760 + rand(i + 71) * 280} width={2 + rand(i + 72) * 3} height={40 + rand(i + 73) * 130} fill="#f3dca0" opacity={0.04 + rand(i + 74) * 0.1} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 8, background: 'rgba(243,220,160,0.16)'}} />
    </AbsoluteFill>
  );
};

const ServerPlate: React.FC<{f: number}> = ({f}) => {
  const at = fb(97);
  const p = clamp01((f - at) / 480);
  const z = 1.02 + p * 0.1;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #04070b 0%, #071018 52%, #030405 100%)'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 54%'}}>
        <svg width={1920} height={1080} style={{position: 'absolute'}}>
          <defs>
            <radialGradient id="server-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#7fb4d8" stopOpacity={0.22} />
              <stop offset="0.5" stopColor="#3d6f92" stopOpacity={0.08} />
              <stop offset="1" stopColor="#3d6f92" stopOpacity={0} />
            </radialGradient>
            <linearGradient id="server-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#081018" />
              <stop offset="1" stopColor="#020304" />
            </linearGradient>
          </defs>
          <rect x={0} y={0} width={1920} height={1080} fill="url(#server-floor)" />
          <ellipse cx={960} cy={520} rx={760} ry={440} fill="url(#server-glow)" />
          {/* 天花板灯带 */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={760} y={90 + i * 54} width={400} height={6} fill="#bfe2f2" opacity={0.18} />
              <ellipse cx={960} cy={96 + i * 54} rx={300} ry={24} fill="url(#server-glow)" />
            </g>
          ))}
          {/* 两侧机柜 */}
          {Array.from({length: 7}, (_, row) => {
            const y = 300 + row * 100;
            const s = 0.7 + row * 0.05;
            return (
              <g key={row} opacity={0.55 + row * 0.05}>
                <g transform={`translate(${120 - row * 10} ${y})`}>
                  <rect x={0} y={0} width={230 * s} height={86} fill="#05080b" stroke="rgba(127,180,216,0.22)" />
                  {Array.from({length: 10}, (_, i) => (
                    <rect key={i} x={14 + (i % 5) * 42} y={14 + Math.floor(i / 5) * 30} width={26} height={12} fill={rand(row * 20 + i + 80) > 0.5 ? '#7fb4d8' : '#d6b46a'} opacity={0.3 + 0.5 * Math.abs(Math.sin(f * 0.05 + i + row))} />
                  ))}
                </g>
                <g transform={`translate(${1570 + row * 10} ${y})`}>
                  <rect x={0} y={0} width={230 * s} height={86} fill="#05080b" stroke="rgba(127,180,216,0.22)" />
                  {Array.from({length: 10}, (_, i) => (
                    <rect key={i} x={14 + (i % 5) * 42} y={14 + Math.floor(i / 5) * 30} width={26} height={12} fill={rand(row * 30 + i + 90) > 0.5 ? '#7fb4d8' : '#d6b46a'} opacity={0.3 + 0.5 * Math.abs(Math.sin(f * 0.04 + i + row))} />
                  ))}
                </g>
              </g>
            );
          })}
          {/* 中央机柜：把走廊尽头补满 */}
          <g transform={`translate(${700 - p * 40} ${300 - p * 10})`}>
            <rect x={0} y={0} width={520} height={500} fill="#04080c" stroke="rgba(127,180,216,0.32)" strokeWidth={2} />
            <rect x={18} y={18} width={484} height={464} fill="rgba(8,18,26,0.9)" stroke="rgba(127,180,216,0.16)" />
            {Array.from({length: 8}, (_, row) => (
              <g key={row}>
                <rect x={34} y={34 + row * 55} width={452} height={42} fill="#061018" stroke="rgba(127,180,216,0.18)" />
                {Array.from({length: 9}, (_, i) => (
                  <rect key={i} x={48 + i * 48} y={42 + row * 55} width={28} height={9} fill={rand(row * 12 + i + 300) > 0.45 ? '#7fb4d8' : '#d6b46a'} opacity={0.35 + 0.5 * Math.abs(Math.sin(f * 0.04 + i + row))} />
                ))}
                <circle cx={458} cy={55 + row * 55} r={4} fill={Math.sin(f * 0.07 + row) > 0 ? '#7fb4d8' : '#1a303c'} />
              </g>
            ))}
            <rect x={34} y={478} width={452} height={2} fill="rgba(127,180,216,0.25)" />
          </g>
          {/* 地面反光 */}
          <rect x={0} y={900} width={1920} height={180} fill="#020304" />
          {Array.from({length: 20}, (_, i) => (
            <rect key={i} x={160 + i * 82} y={900} width={2} height={100 + rand(i + 100) * 80} fill="#7fb4d8" opacity={0.05 + rand(i + 101) * 0.1} />
          ))}
          {/* 前景线缆 */}
          {Array.from({length: 12}, (_, i) => (
            <path key={i} d={`M 0 ${180 + i * 22} Q 500 ${120 + i * 18} 960 ${190 + i * 16} T 1920 ${150 + i * 24}`} fill="none" stroke="rgba(127,180,216,0.1)" strokeWidth={1.2} />
          ))}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CommuterPlate: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.commuterBroll[0];
  const p = clamp01((f - at) / 300);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0d0a07 0%, #2a2013 46%, #070504 100%)'}}>
      <AbsoluteFill style={{transform: `scale(${1.03 + p * 0.07})`, transformOrigin: '50% 45%'}}>
        <svg width={1920} height={1080} style={{position: 'absolute'}}>
          <defs>
            <radialGradient id="commuter-light" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#ffe4b0" stopOpacity={0.42} />
              <stop offset="0.5" stopColor="#d6b46a" stopOpacity={0.1} />
              <stop offset="1" stopColor="#d6b46a" stopOpacity={0} />
            </radialGradient>
          </defs>
          {[240, 760, 1280, 1700].map((x, i) => (
            <g key={i}>
              <rect x={x} y={40} width={260} height={10} fill="#efe6d2" opacity={0.18} />
              <ellipse cx={x + 130} cy={100} rx={300} ry={220} fill="url(#commuter-light)" opacity={1.2} />
            </g>
          ))}
          {/* 站厅结构 */}
          <path d="M 0 700 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#0c0906" />
          <ellipse cx={960} cy={520} rx={780} ry={330} fill="url(#commuter-light)" opacity={0.75} />
          <rect x={0} y={250} width={1920} height={420} fill="rgba(243,220,160,0.045)" />
          {Array.from({length: 9}, (_, i) => (
            <line key={i} x1={i * 240} y1={700} x2={i * 240 - 160} y2={1080} stroke="rgba(214,180,106,0.1)" />
          ))}
          {/* 闸机 */}
          {[560, 880, 1200, 1520].map((x, i) => (
            <g key={i} transform={`translate(${x} 560)`} opacity={0.7}>
              <rect x={0} y={0} width={44} height={210} fill="#19130c" stroke="rgba(214,180,106,0.55)" />
              <rect x={44} y={50} width={80} height={80} fill="#20180e" stroke="rgba(214,180,106,0.4)" />
              <circle cx={84} cy={90} r={5} fill={Math.sin(f * 0.1 + i) > 0 ? G.goldBright : 'rgba(214,180,106,0.2)'} />
              <line x1={124} y1={90} x2={190} y2={90} stroke={G.gold} strokeWidth={2} opacity={0.35} />
            </g>
          ))}
          {/* 人流：剪影 + 速度拖影 */}
          {Array.from({length: 46}, (_, i) => {
            const speed = 0.0015 + rand(i + 200) * 0.0012;
            const t = ((f * speed + rand(i + 201)) % 1 + 1) % 1;
            const x = -120 + t * 2160;
            const baseY = 660 + rand(i + 202) * 150;
            const h = 70 + rand(i + 203) * 46;
            const blur = 0.18 + rand(i + 204) * 0.22;
            return (
              <g key={i} opacity={0.55 + rand(i + 205) * 0.35}>
                <circle cx={x - 16} cy={baseY - h} r={13 + rand(i + 206) * 5} fill="#211a10" stroke="rgba(243,220,160,0.22)" opacity={blur} />
                <rect x={x - 20} y={baseY - h + 16} width={40} height={h} rx={8} fill="#211a10" stroke="rgba(243,220,160,0.22)" opacity={blur} />
                <circle cx={x} cy={baseY - h} r={12 + rand(i + 207) * 4} fill="#241c11" stroke="rgba(243,220,160,0.32)" />
                <rect x={x - 18} y={baseY - h + 15} width={36} height={h} rx={8} fill="#241c11" stroke="rgba(243,220,160,0.32)" />
                <rect x={x - 10} y={baseY - h - 18} width={4} height={18} fill="rgba(243,220,160,0.12)" />
              </g>
            );
          })}
          {/* 地面反光 */}
          {Array.from({length: 18}, (_, i) => (
            <rect key={i} x={60 + i * 104} y={880} width={2 + rand(i + 210) * 4} height={60 + rand(i + 211) * 100} fill="#f3dca0" opacity={0.03 + rand(i + 212) * 0.08} />
          ))}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BrollLayer: React.FC<{f: number}> = ({f}) => {
  const office = vis(f, fb(65), fb(69), 18, 20);
  const server = vis(f, fb(97), fb(105), 20, 20);
  const toll = vis(f, fb(114), SHOTS.billMontage[1], 18, 18);
  const commuter = vis(f, SHOTS.commuterBroll[0], fb(125), 20, 20);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {office > 0 ? <Plate f={f} o={office * 0.52}><OfficePrintPlate f={f} /></Plate> : null}
      {server > 0 ? <Plate f={f} o={server * 0.62}><ServerPlate f={f} /></Plate> : null}
      {toll > 0 ? <Plate f={f} o={toll * 0.6}><TollPlate f={f} /></Plate> : null}
      {commuter > 0 ? <Plate f={f} o={commuter * 0.68}><CommuterPlate f={f} /></Plate> : null}
      <AbsoluteFill style={{background: 'rgba(0,0,0,0.08)'}} />
    </AbsoluteFill>
  );
};

const chartLine = (points: [number, number][]) => points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');

export const DataHud: React.FC<{f: number}> = ({f}) => {
  const a = vis(f, fb(75), fb(89), 20, 20);
  const b = vis(f, fb(114), SHOTS.billMontage[1], 16, 16);
  const o = Math.max(a, b);
  if (o <= 0) return null;
  const p = clamp01((f - fb(75)) / 380);
  const x0 = 1380;
  const y0 = 92;
  const w = 430;
  const h = 210;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>
      <div style={{position: 'absolute', left: x0, top: y0, width: w, height: h, border: `1px solid ${G.goldFaint}`, background: 'rgba(3,3,3,0.68)', padding: '14px 18px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: GF.cn, fontSize: 14, letterSpacing: 3, color: G.ivoryDim}}>
          <span>REBOUND INDEX</span><span>UNIT PRICE / DEMAND</span>
        </div>
        <svg width={w - 36} height={118} style={{marginTop: 10}}>
          {[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={20 + i * 28} x2={w - 36} y2={20 + i * 28} stroke="rgba(214,180,106,0.12)" strokeWidth={1} />)}
          <path d={chartLine([[0, 18], [70, 32], [140, 54], [210, 62], [280, 86], [350, 96], [390, 100]])} fill="none" stroke={G.ivoryDim} strokeWidth={2} />
          <path d={chartLine([[0, 104], [70, 92], [140, 76], [210, 58], [280, 36], [350, 22], [390, 14]])} fill="none" stroke={G.goldBright} strokeWidth={2} />
          <circle cx={390 * p} cy={104 - 90 * p} r={5} fill={G.goldBright} style={{filter: `drop-shadow(0 0 8px ${G.gold})`}} />
          <text x={0} y={116} fontFamily={GF.cn} fontSize={12} fill={G.ivoryFaint}>单价 ↓</text>
          <text x={w - 90} y={12} fontFamily={GF.cn} fontSize={12} fill={G.goldBright}>需求 ↑</text>
        </svg>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: GF.num, fontSize: 13, color: G.ivoryFaint}}>
          <span>1975</span><span>2025</span><span style={{color: G.goldBright}}>×2.8</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BrollShot: React.FC<{f: number; kind: 'office' | 'server' | 'toll' | 'commuter'; at: number; title: string; stat: string; sub: string}> = ({f, kind, at, title, stat, sub}) => {
  const o = vis(f, at, at + 9999, 12, 12);
  return (
    <AbsoluteFill>
      <Plate f={f} o={0.96} bright={kind === 'commuter' ? 1.75 : kind === 'toll' ? 1.85 : 1.6}>
        {kind === 'office' ? <OfficePrintPlate f={f} /> : kind === 'server' ? <ServerPlate f={f} /> : kind === 'toll' ? <TollPlate f={f} /> : <CommuterPlate f={f} />}
      </Plate>
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div style={{position: 'absolute', left: 62, top: 690, opacity: o}}>
          <div style={{fontFamily: GF.cn, fontSize: 18, letterSpacing: 5, color: G.gold}}>{title}</div>
          <div style={{width: 300, height: 1, background: `linear-gradient(90deg, ${G.goldBright}, rgba(214,180,106,0))`, marginTop: 8}} />
          <div style={{fontFamily: GF.num, fontSize: 76, lineHeight: 1, marginTop: 14, ...goldText(0.7)}}>{stat}</div>
          <div style={{fontFamily: GF.cn, fontSize: 18, letterSpacing: 3, color: G.ivoryDim, marginTop: 6}}>{sub}</div>
        </div>
        <div style={{position: 'absolute', right: 54, top: 44, display: 'flex', alignItems: 'center', gap: 10, opacity: 0.65}}>
          <div style={{width: 9, height: 9, borderRadius: '50%', background: G.red, boxShadow: `0 0 10px ${G.red}`}} />
          <span style={{fontFamily: GF.latin, fontSize: 13, letterSpacing: 3, color: G.ivoryDim}}>B-ROLL · 2025 · {Math.floor(f / 30)}S</span>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(243,220,160,0.18)'}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
