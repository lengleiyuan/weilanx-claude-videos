import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut, rand} from '../../library/anim';
import {BookCite, Smash, YearHeader} from '../../library/gilded/stage';
import {G, GF, goldText} from '../../library/gilded/theme';
import {COAL_MULT, FINAL_QUESTION, fb, fr, HIT, MACHINE_MULT, NVDA_DROP_PCT, NVDA_LOSS_B, O1_PRICE, PRICE_RATIO, R1_PRICE, SHOTS, WATT_COAL_SAVING_PCT} from './timeline';

/**
 * ep52 的各段画面。所有组件拿全局帧 f，自己按 timeline 的小节算出场时间。
 * 画面语言沿用暗金文献风：近黑底、金色细线、衬线字、柔入、慢推；
 * 这一期额外做了一套「发光实物」——煤块、蒸汽机、厂房、公路、服务器、天平，让抽象的经济学有东西可看。
 */

/** 段落可见度：a 到 b 之间可见，两头各 fin / fout 帧柔入柔出 */
export const vis = (f: number, a: number, b: number, fin = 12, fout = 12) => clamp01((f - a) / fin) * (1 - clamp01((f - (b - fout)) / fout));

/** 柔入：透明度 + 模糊 */
const softIn = (f: number, at: number, dur = 16) => {
  const v = clamp01((f - at) / dur);
  return {opacity: v, filter: `blur(${(1 - v) * 6}px)`};
};

/* ---------------- 通用小件 ---------------- */

export const SceneLabel: React.FC<{f: number; at: number; text: string; sub?: string; x?: number; y?: number}> = ({f, at, text, sub, x = 56, y = 34}) => (
  <div style={{position: 'absolute', left: x, top: y, ...softIn(f, at, 20)}}>
    <div style={{fontFamily: GF.cn, fontSize: 20, letterSpacing: 6, color: G.gold, textTransform: 'uppercase'}}>{text}</div>
    {sub ? <div style={{fontFamily: GF.latinItalic, fontSize: 16, letterSpacing: 2, color: G.ivoryFaint, marginTop: 6}}>{sub}</div> : null}
    <div style={{width: 220, height: 1, marginTop: 10, background: `linear-gradient(90deg, ${G.goldLine}, rgba(214,180,106,0))`}} />
  </div>
);

export const SourceNote: React.FC<{children: React.ReactNode; x?: number; y?: number; right?: boolean}> = ({children, x = 56, y = 850, right}) => (
  <div style={{position: 'absolute', left: right ? undefined : x, right: right ? x : undefined, top: y, maxWidth: 900, fontFamily: GF.cn, fontSize: 15, lineHeight: 1.5, color: G.ivoryFaint, letterSpacing: 1}}>{children}</div>
);

/* ---------------- 冷开场：四张证据卡 ---------------- */

const HwyIcon: React.FC = () => (
  <svg width={150} height={110} viewBox="0 0 150 110">
    <polygon points="35,105 115,105 90,20 60,20" fill="rgba(214,180,106,0.06)" stroke={G.goldLine} strokeWidth={1} />
    <line x1="75" y1="20" x2="75" y2="105" stroke={G.goldBright} strokeWidth={2} strokeDasharray="10 8" opacity={0.8} />
    <line x1="56" y1="20" x2="52" y2="105" stroke={G.goldLine} strokeWidth={1} strokeDasharray="6 8" />
    <line x1="94" y1="20" x2="98" y2="105" stroke={G.goldLine} strokeWidth={1} strokeDasharray="6 8" />
    {[30, 55, 80].map((y, i) => (
      <rect key={i} x={68 + (i % 2) * 8} y={y} width={10} height={5} fill={i === 1 ? G.red : G.goldBright} opacity={0.9} />
    ))}
  </svg>
);

const BulbIcon: React.FC = () => (
  <svg width={150} height={110} viewBox="0 0 150 110">
    <circle cx={75} cy={46} r={24} fill="rgba(243,220,160,0.12)" stroke={G.goldBright} strokeWidth={1.6} />
    <path d="M68 70 L68 80 L82 80 L82 70" fill="none" stroke={G.gold} strokeWidth={1.4} />
    <path d="M70 48 Q75 34 80 48 M70 48 Q75 60 80 48" fill="none" stroke={G.goldBright} strokeWidth={1} />
    {Array.from({length: 8}, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <line key={i} x1={75 + Math.cos(a) * 34} y1={46 + Math.sin(a) * 34} x2={75 + Math.cos(a) * 42} y2={46 + Math.sin(a) * 42} stroke={G.gold} strokeWidth={1} opacity={0.6} />;
    })}
  </svg>
);

const PaperIcon: React.FC = () => (
  <svg width={150} height={110} viewBox="0 0 150 110">
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${34 + i * 8} ${18 + i * 8})`}>
        <rect width={70} height={78} fill="rgba(239,230,210,0.06)" stroke={G.goldLine} />
        {[0, 1, 2, 3, 4].map((j) => (
          <line key={j} x1={10} y1={18 + j * 10} x2={i === 2 ? 58 : 52} y2={18 + j * 10} stroke={G.ivoryDim} strokeWidth={1} opacity={0.55} />
        ))}
      </g>
    ))}
    <text x={118} y={88} fontFamily={GF.num} fontSize={24} fill={G.goldBright}>×3</text>
  </svg>
);

const AiIcon: React.FC = () => (
  <svg width={150} height={110} viewBox="0 0 150 110">
    <circle cx={66} cy={52} r={30} fill="none" stroke={G.goldLine} strokeWidth={1.4} />
    {Array.from({length: 12}, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={66 + Math.cos(a) * 36} y1={52 + Math.sin(a) * 36} x2={66 + Math.cos(a) * 41} y2={52 + Math.sin(a) * 41} stroke={G.gold} strokeWidth={1} opacity={0.5} />;
    })}
    <line x1={66} y1={52} x2={66} y2={32} stroke={G.goldBright} strokeWidth={2} />
    <line x1={66} y1={52} x2={82} y2={60} stroke={G.goldBright} strokeWidth={2} />
    <path d="M106 28 L110 40 L122 44 L110 48 L106 60 L102 48 L90 44 L102 40 Z" fill={G.goldBright} opacity={0.85} />
  </svg>
);

const EvidenceCard: React.FC<{f: number; at: number; x: number; y: number; stat: string; label: string; icon: React.ReactNode; active: boolean}> = ({f, at, x, y, stat, label, icon, active}) => {
  const s = active ? (at === 0 ? {opacity: 1, filter: 'none'} : softIn(f, at, 12)) : {opacity: 0.26, filter: 'blur(0.4px)'};
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 620, height: 250, ...s, transform: `translateY(${(1 - clamp01((f - at) / 14)) * 14}px)`}}>
      <div style={{position: 'absolute', inset: 0, border: `1px solid ${active ? G.goldLine : G.goldFaint}`, background: 'linear-gradient(150deg, rgba(30,22,12,0.78), rgba(3,3,3,0.4))'}} />
      <div style={{position: 'absolute', left: 26, top: 26, width: 150, height: 110, opacity: 0.95}}>{icon}</div>
      <div style={{position: 'absolute', left: 200, top: 44, fontFamily: GF.num, fontSize: 66, lineHeight: 1, ...goldText(active ? 0.7 : 0.2)}}>{stat}</div>
      <div style={{position: 'absolute', left: 202, top: 126, fontFamily: GF.cn, fontSize: 26, letterSpacing: 4, color: G.ivory}}>{label}</div>
      <div style={{position: 'absolute', left: 0, top: 0, width: active ? '100%' : 0, height: 1, background: G.goldBright, opacity: 0.5}} />
      <div style={{position: 'absolute', right: 18, bottom: 14, fontFamily: GF.num, fontSize: 14, color: G.ivoryFaint, letterSpacing: 2}}>{active ? 'NOW' : ''}</div>
    </div>
  );
};

export const ColdOpen: React.FC<{f: number}> = ({f}) => {
  const cards: [number, number, number, string, string, React.ReactNode][] = [
    [fb(0), 290, 210, '4 → 8', '车 道', <HwyIcon key="h" />],
    [fb(1), 1010, 210, '−90%', '亮 度', <BulbIcon key="b" />],
    [fb(2), 290, 540, '×3', '用 纸', <PaperIcon key="p" />],
    [fb(3), 1010, 540, '2h → 8h', '工 时', <AiIcon key="a" />],
  ];
  const collapse = easeInOut(clamp01((f - fb(3.55)) / 12));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 290, top: 160, fontFamily: GF.cn, fontSize: 22, letterSpacing: 8, color: G.ivoryDim, opacity: 1 - collapse}}>
        四件不相干的事
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 104, textAlign: 'center', opacity: 1 - collapse}}>
        <span style={{fontFamily: GF.cn, fontSize: 30, fontWeight: 700, letterSpacing: 12, color: G.goldBright, textShadow: '0 0 18px rgba(243,220,160,0.45)'}}>越省越多？</span>
      </div>
      <div style={{position: 'absolute', left: 290, top: 196, width: 1340, height: 1, background: `linear-gradient(90deg, ${G.goldLine}, rgba(214,180,106,0))`, opacity: 0.5 * (1 - collapse)}} />
      <div style={{position: 'absolute', left: 960, top: 196, width: 1, height: 600, background: `linear-gradient(180deg, rgba(214,180,106,0.28), rgba(214,180,106,0))`, opacity: 0.5 * (1 - collapse)}} />
      <div style={{position: 'absolute', left: 1650, top: 780, fontFamily: GF.num, fontSize: 18, letterSpacing: 3, color: G.ivoryFaint, opacity: 1 - collapse}}>01 — 04</div>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '960px 520px', transform: `scale(${1 - 0.92 * collapse})`, opacity: 1 - collapse}}>
        {cards.map(([at, x, y, stat, label, icon], i) => (
          <EvidenceCard key={i} f={f} at={at} x={x} y={y} stat={stat} label={label} icon={icon} active={f >= at && (i === 3 || f < cards[i + 1][0])} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 940, top: 500, width: 40, height: 40, borderRadius: '50%', background: G.goldBright, boxShadow: `0 0 60px 20px rgba(243,220,160,0.55)`, opacity: collapse, transform: `scale(${0.4 + collapse * 1.4})`}} />
    </AbsoluteFill>
  );
};

/* ---------------- 片头标题 ---------------- */

export const TitleScene: React.FC<{f: number}> = ({f}) => {
  const t = f - HIT;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 255, textAlign: 'center', fontFamily: GF.latin, fontSize: 22, letterSpacing: 16, color: G.ivoryDim, opacity: clamp01((t - 6) / 16)}}>
        1865 · THE COAL QUESTION
      </div>
      <Smash f={f} at={HIT} text="杰文斯悖论" size={150} sub="THE JEVONS PARADOX" ring={1300} flash={1} y={470} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: GF.cn, fontSize: 34, letterSpacing: 10, color: G.ivory, opacity: clamp01((t - 24) / 16)}}>
        为什么越省，反而越多？
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 1865：书 ---------------- */

export const BookScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.book[0];
  const open = easeInOut(clamp01((f - at - 4) / 26));
  return (
    <AbsoluteFill>
      <YearHeader f={f} at={at} year="1865" caption="伦敦 · 威廉·斯坦利·杰文斯" />
      <BookCite f={f} at={at} original="The Coal Question" title="煤炭问题" meta="W. Stanley Jevons · 1865" seal="文献" />
      <div style={{position: 'absolute', left: 470, top: 225, width: 980, height: 590, perspective: 1400, opacity: clamp01((f - at) / 20)}}>
        <div style={{position: 'absolute', inset: 0, transform: `rotateX(10deg) rotateY(${-16 + 8 * open}deg) scaleX(${0.7 + 0.3 * open})`, transformOrigin: '50% 100%'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 490, height: 570, background: 'linear-gradient(115deg, #1b140b 0%, #2a1e10 60%, #140e07 100%)', border: `1px solid ${G.goldDeep}`, boxShadow: '18px 30px 70px rgba(0,0,0,0.8), inset 0 0 80px rgba(0,0,0,0.8)'}}>
            <div style={{position: 'absolute', left: 46, top: 56, right: 46, fontFamily: GF.latin, fontSize: 20, letterSpacing: 5, color: G.ivoryDim}}>THE</div>
            <div style={{position: 'absolute', left: 46, top: 96, right: 30, fontFamily: GF.latin, fontSize: 52, lineHeight: 1.05, letterSpacing: 3, ...goldText(0.55)}}>COAL<br />QUESTION</div>
            <div style={{position: 'absolute', left: 46, top: 250, width: 120, height: 1, background: G.goldLine}} />
            <div style={{position: 'absolute', left: 46, top: 280, right: 40, fontFamily: GF.latin, fontSize: 21, lineHeight: 1.6, color: G.ivory}}>
              W. STANLEY JEVONS, M.A.
              <br />
              <span style={{color: G.ivoryDim, fontSize: 17}}>PROFESSOR OF LOGIC AND POLITICAL ECONOMY</span>
            </div>
            <div style={{position: 'absolute', left: 46, bottom: 64, fontFamily: GF.latin, fontSize: 17, letterSpacing: 2, color: G.ivoryDim}}>
              LONDON · MACMILLAN AND CO. · 1865
            </div>
            {Array.from({length: 18}, (_, i) => (
              <div key={i} style={{position: 'absolute', left: 0, right: 0, bottom: 18 + i * 1.2, height: 1, background: 'rgba(214,180,106,0.05)'}} />
            ))}
          </div>
          <div style={{position: 'absolute', left: 490, top: 0, width: 490, height: 570, background: 'linear-gradient(90deg, #241a0e 0%, #1b140b 35%, #0f0a05 100%)', border: `1px solid ${G.goldDeep}`, boxShadow: '18px 30px 70px rgba(0,0,0,0.8), inset 0 0 80px rgba(0,0,0,0.85)'}}>
            <div style={{position: 'absolute', left: 40, top: 54, fontFamily: GF.cn, fontSize: 28, letterSpacing: 8, color: G.gold}}>煤炭问题</div>
            <div style={{position: 'absolute', left: 40, top: 104, width: 400, height: 1, background: G.goldLine}} />
            <div style={{position: 'absolute', left: 40, top: 136, width: 410, fontFamily: GF.cn, fontSize: 19, lineHeight: 1.8, color: G.ivoryDim}}>
              一个国家的力量，
              <br />
              不只在于它有多少煤，
              <br />
              更在于它怎样使用每一吨煤。
            </div>
            <div style={{position: 'absolute', left: 40, top: 300, width: 410, height: 1, background: G.goldFaint}} />
            <div style={{position: 'absolute', left: 40, top: 330, width: 410, fontFamily: GF.latinItalic, fontSize: 20, lineHeight: 1.6, color: G.ivory}}>
              “Coal is not only the fuel of industry, but the material of progress.”
            </div>
            <div style={{position: 'absolute', left: 40, bottom: 64, fontFamily: GF.cn, fontSize: 45, letterSpacing: 12, ...goldText(0.75)}}>煤炭</div>
            <div style={{position: 'absolute', left: 220, bottom: 66, fontFamily: GF.latin, fontSize: 16, letterSpacing: 4, color: G.ivoryFaint}}>THE MATERIAL OF PROGRESS</div>
          </div>
          <div style={{position: 'absolute', left: 486, top: 24, width: 8, height: 522, background: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(214,180,106,0.28), rgba(0,0,0,0.9))'}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 780, width: 300, fontFamily: GF.cn, fontSize: 18, color: G.ivoryFaint, letterSpacing: 2, ...softIn(f, at + 30, 20)}}>
        第一版 1865 年 · 伦敦
        <br />
        <span style={{fontFamily: GF.latinItalic}}>The Coal Question</span>
      </div>
      <SourceNote>史料：W. Stanley Jevons,《The Coal Question》(1865)。画面为示意排版，不是原书扫描。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 瓦特蒸汽机 ---------------- */

const EngineSvg: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = Math.max(0, f - at);
  const a = Math.sin(t / 13) * 0.06;
  const fly = t * 2.6;
  const pivotX = 430;
  const pivotY = 300;
  const endX = pivotX + 250 * Math.cos(a);
  const endY = pivotY + 250 * Math.sin(a);
  const crankX = 775 + Math.cos(fly) * 74;
  const crankY = 540 + Math.sin(fly) * 74;
  return (
    <svg width={960} height={700} viewBox="0 0 960 700" style={{position: 'absolute', left: 30, top: 210}}>
      <defs>
        <linearGradient id="jevons-iron2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3dca0" stopOpacity={0.95} />
          <stop offset="0.5" stopColor="#b08a45" stopOpacity={0.8} />
          <stop offset="1" stopColor="#3a2a14" stopOpacity={1} />
        </linearGradient>
        <radialGradient id="jevons-fire2" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffe1a8" stopOpacity={0.95} />
          <stop offset="0.35" stopColor="#e09a34" stopOpacity={0.5} />
          <stop offset="1" stopColor="#e09a34" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="jevons-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#d6b46a" stopOpacity={0.34} />
          <stop offset="1" stopColor="#d6b46a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={480} cy={650} rx={430} ry={80} fill="url(#jevons-floor)" />
      <path d="M50 650 H920" stroke={G.goldLine} strokeWidth={1.4} />
      <path d="M80 650 L150 690 H850 L920 650" fill="rgba(214,180,106,0.03)" stroke={G.goldFaint} />

      {/* 锅炉：横置圆筒 + 火门 + 烟囱 */}
      <g>
        <rect x={110} y={455} width={250} height={140} rx={70} fill="rgba(20,15,9,0.96)" stroke={G.gold} strokeWidth={2.4} />
        <rect x={110} y={500} width={70} height={52} rx={6} fill="#0a0703" stroke={G.goldDeep} />
        <circle cx={145} cy={526} r={24} fill="url(#jevons-fire2)" />
        <path d="M180 455 V370 H270 V455" fill="none" stroke={G.gold} strokeWidth={2.4} />
        <path d="M205 370 V330 M245 370 V330" stroke={G.goldLine} strokeWidth={2} />
        <circle cx={300} cy={490} r={20} fill="none" stroke={G.goldBright} strokeWidth={2} />
        <line x1={300} y1={490} x2={300} y2={474} stroke={G.goldBright} strokeWidth={2} />
        <line x1={300} y1={490} x2={313} y2={495} stroke={G.goldBright} strokeWidth={2} />
        {/* 煤堆 */}
        <path d="M70 650 L92 592 L122 610 L146 580 L174 612 L202 588 L232 650 Z" fill="rgba(24,17,10,0.98)" stroke={G.gold} strokeWidth={1.4} />
        <path d="M96 604 L122 610 L146 580 L172 612" fill="none" stroke={G.goldBright} strokeWidth={1.2} opacity={0.65} />
      </g>

      {/* A 型支架 */}
      <path d="M350 650 L430 300 M510 650 L430 300" stroke="url(#jevons-iron2)" strokeWidth={14} strokeLinecap="round" />
      <path d="M372 520 H488 M386 440 H474" stroke={G.goldLine} strokeWidth={3} />
      <circle cx={430} cy={300} r={14} fill={G.goldBright} />

      {/* 横梁 */}
      <g transform={`rotate(${(a * 180) / Math.PI} ${pivotX} ${pivotY})`}>
        <line x1={180} y1={300} x2={680} y2={300} stroke={G.gold} strokeWidth={16} strokeLinecap="round" />
        <line x1={180} y1={294} x2={680} y2={294} stroke={G.goldBright} strokeWidth={2} opacity={0.75} />
        <circle cx={430} cy={300} r={18} fill={G.gold} stroke={G.goldBright} />
        <line x1={200} y1={300} x2={200} y2={340} stroke={G.gold} strokeWidth={4} />
        <path d="M180 340 H220" stroke={G.goldBright} strokeWidth={3} />
      </g>

      {/* 汽缸 + 活塞杆 */}
      <g>
        <rect x={620} y={360} width={86} height={170} rx={10} fill="rgba(22,16,10,0.97)" stroke={G.gold} strokeWidth={2.4} />
        <rect x={652} y={250} width={10} height={110} fill={G.goldBright} />
        <line x1={endX} y1={endY} x2={657} y2={360} stroke={G.goldBright} strokeWidth={4} />
        <line x1={620} y1={420} x2={706} y2={420} stroke={G.goldLine} strokeWidth={2} />
        <path d="M620 390 H706" stroke={G.goldFaint} strokeWidth={1} />
      </g>

      {/* 飞轮与连杆 */}
      <g transform={`translate(775 540)`}>
        <circle r={112} fill="none" stroke={G.gold} strokeWidth={3.5} />
        <circle r={94} fill="none" stroke={G.goldFaint} strokeWidth={1} />
        <g transform={`rotate(${(fly * 180) / Math.PI})`}>
          {Array.from({length: 8}, (_, i) => {
            const ang = (i / 8) * Math.PI * 2;
            return <line key={i} x1={0} y1={0} x2={Math.cos(ang) * 108} y2={Math.sin(ang) * 108} stroke={G.goldLine} strokeWidth={2.4} />;
          })}
        </g>
        <circle r={16} fill={G.goldBright} />
        <circle cx={Math.cos(fly) * 74} cy={Math.sin(fly) * 74} r={7} fill={G.goldBright} />
      </g>
      <line x1={endX} y1={endY} x2={crankX} y2={crankY} stroke={G.goldBright} strokeWidth={3.4} />

      {/* 蒸汽 */}
      {Array.from({length: 8}, (_, i) => {
        const life = (f / 2 + i * 22) % 120;
        const o = (1 - life / 120) * 0.32;
        return <circle key={i} cx={664 + life * 0.55} cy={250 - life * 1.7} r={7 + life * 0.18} fill={G.ivory} opacity={o} />;
      })}
      <text x={430} y={690} textAnchor="middle" fontFamily={GF.latin} fontSize={16} letterSpacing={5} fill={G.ivoryFaint}>BOULTON &amp; WATT · 1776</text>
    </svg>
  );
};

export const EngineScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.engine[0];
  const cheer = clamp01((f - fb(11)) / 12);
  return (
    <AbsoluteFill>
      <YearHeader f={f} at={at} year="1776" caption="伯明翰 · 詹姆斯·瓦特" />
      <SceneLabel f={f} at={at + 6} text="THE STEAM ENGINE" sub="同样的功，三分之一的煤" x={1420} y={40} />
      <EngineSvg f={f} at={at} />
      <div style={{position: 'absolute', left: 1030, top: 285, width: 340, opacity: clamp01((f - at - 10) / 20)}}>
        <div style={{fontFamily: GF.cn, fontSize: 18, letterSpacing: 6, color: G.ivoryDim}}>每马力小时耗煤</div>
        <div style={{fontFamily: GF.num, fontSize: 128, lineHeight: 1.1, ...goldText(0.7)}}>−{WATT_COAL_SAVING_PCT}<span style={{fontSize: 58}}>%</span></div>
        <div style={{position: 'relative', width: 280, height: 8, background: 'rgba(239,230,210,0.12)', marginTop: 8}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${34 * clamp01((f - at - 20) / 24)}%`, background: G.goldBright, boxShadow: `0 0 16px ${G.gold}`}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: GF.num, fontSize: 14, color: G.ivoryFaint, marginTop: 8}}>
          <span>33</span>
          <span>100</span>
        </div>
        <div style={{fontFamily: GF.cn, fontSize: 17, lineHeight: 1.8, color: G.ivory, marginTop: 22}}>
          同样的蒸汽，<br />推得更远、更便宜。
        </div>
      </div>
      {f >= fb(11) ? (
        <div style={{position: 'absolute', left: 1240, top: 470, width: 500, height: 300, opacity: cheer, transform: `translateY(${(1 - cheer) * 20}px)`, background: 'linear-gradient(160deg, #d9c59a, #b99a63)', border: `1px solid ${G.goldBright}`, boxShadow: '0 30px 80px rgba(0,0,0,0.7)'}}>
          <div style={{position: 'absolute', left: 26, top: 22, right: 26, height: 1, background: 'rgba(30,20,8,0.5)'}} />
          <div style={{position: 'absolute', left: 26, top: 40, fontFamily: GF.latin, fontSize: 16, letterSpacing: 5, color: '#3a2a12'}}>THE TIMES · 1785</div>
          <div style={{position: 'absolute', left: 26, top: 78, right: 26, fontFamily: GF.latin, fontWeight: 700, fontSize: 46, lineHeight: 1.02, letterSpacing: 1, color: '#1c1206'}}>COAL<br />SAVED!</div>
          <div style={{position: 'absolute', left: 26, top: 200, right: 100, fontFamily: GF.cn, fontSize: 21, lineHeight: 1.5, color: '#2c1d0c'}}>全英国都在欢呼：<br />煤矿，终于保住了。</div>
          <div style={{position: 'absolute', right: 20, bottom: 20, width: 86, height: 86, border: `3px solid ${G.sealRed}`, color: G.sealRed, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: GF.cn, fontWeight: 700, fontSize: 22, transform: 'rotate(-12deg)', opacity: 0.8}}>欢呼</div>
        </div>
      ) : null}
      <SourceNote>数据：瓦特蒸汽机的煤耗约为纽科门机的三分之一（省煤约 2/3）。报纸为示意版面，不是史料原件。</SourceNote>
    </AbsoluteFill>
  );
};
const coalLump = (x: number, y: number, s: number, seed: number) => {
  const pts = Array.from({length: 7}, (_, i) => {
    const a = (i / 7) * Math.PI * 2;
    const r = (22 + rand(seed + i) * 12) * s;
    return `${x + Math.cos(a) * r},${y + Math.sin(a) * r * 0.62}`;
  }).join(' ');
  return pts;
};

export const CoalScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.coal[0];
  const p = clamp01((f - at - 6) / (fb(15) - at - 18));
  const year = 1780 + 120 * p;
  const value = 0.5 * Math.exp(0.025 * (year - 1780));
  const X = (yr: number) => 260 + ((yr - 1780) / 120) * 1120;
  const Y = (v: number) => 680 - (v / 10.5) * 430;
  let d = '';
  for (let i = 0; i <= 80; i++) {
    const u = (i / 80) * p;
    const yr = 1780 + 120 * u;
    const v = 0.5 * Math.exp(0.025 * (yr - 1780));
    d += `${i === 0 ? 'M' : 'L'}${X(yr).toFixed(1)} ${Y(v).toFixed(1)}`;
  }
  const q = clamp01((f - fb(15)) / 14);
  return (
    <AbsoluteFill>
      <YearHeader f={f} at={at} year="1900" prev="1865" rollAt={at + 8} caption="英国 · 煤耗" />
      <div style={{position: 'absolute', left: 260, top: 220, fontFamily: GF.cn, fontSize: 22, letterSpacing: 6, color: G.ivoryDim, opacity: clamp01((f - at) / 16)}}>以瓦特时代为 1</div>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {[0, 2.5, 5, 7.5, 10].map((v) => (
          <g key={v}>
            <line x1={260} y1={Y(v)} x2={1380} y2={Y(v)} stroke={G.goldFaint} strokeDasharray="4 10" />
            <text x={238} y={Y(v) + 6} textAnchor="end" fontFamily={GF.num} fontSize={18} fill={G.ivoryFaint}>{v}×</text>
          </g>
        ))}
        {[1780, 1850, 1900].map((yr) => (
          <text key={yr} x={X(yr)} y={720} textAnchor="middle" fontFamily={GF.num} fontSize={20} fill={G.ivoryFaint}>{yr}</text>
        ))}
        <path d={d} fill="none" stroke={G.goldBright} strokeWidth={3} style={{filter: `drop-shadow(0 0 10px ${G.gold})`}} />
        {p > 0.02 ? <circle cx={X(year)} cy={Y(value)} r={8} fill={G.goldBright} style={{filter: `drop-shadow(0 0 16px ${G.goldBright})`}} /> : null}
        <line x1={260} y1={680} x2={1380} y2={680} stroke={G.goldLine} />
        <line x1={260} y1={220} x2={260} y2={680} stroke={G.goldLine} />
        {/* 两端煤堆：左边一小堆，右边一大片 */}
        {Array.from({length: 3}, (_, i) => <polygon key={`l${i}`} points={coalLump(150 + i * 34, 700 + (i % 2) * 12, 0.75, i + 4)} fill="rgba(18,14,9,0.95)" stroke={G.goldDeep} strokeWidth={1} />)}
        {Array.from({length: 32}, (_, i) => {
          const s = 0.65 + rand(i + 30) * 0.8;
          return <polygon key={`r${i}`} points={coalLump(1430 + (i % 8) * 54 + rand(i) * 20, 620 + Math.floor(i / 8) * 34 + rand(i + 2) * 20, s, i + 90)} fill="rgba(22,17,11,0.95)" stroke={G.goldDeep} strokeWidth={1} opacity={0.85} />;
        })}
        <text x={1470} y={420} textAnchor="middle" fontFamily={GF.num} fontSize={170} fill={G.goldBright} opacity={clamp01((f - fb(13) - 50) / 20)} style={{filter: `drop-shadow(0 0 24px rgba(214,180,106,0.55))`}}>×{COAL_MULT}</text>
        <text x={1470} y={480} textAnchor="middle" fontFamily={GF.cn} fontSize={24} letterSpacing={8} fill={G.ivoryDim} opacity={clamp01((f - fb(13) - 60) / 20)}>煤 耗</text>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', opacity: q * 0.62, transform: `scale(${0.9 + q * 0.1})`}}>
        <span style={{fontFamily: GF.cn, fontWeight: 900, fontSize: 88, letterSpacing: 16, ...goldText(0.6)}}>为什么？</span>
      </div>
      <SourceNote>数据：英国煤耗，示意口径以瓦特时代为 1；到 1900 年约十倍（19 世纪实际涨幅更高）。曲线为示意，不是逐年统计。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 工程师 vs 生意人 ---------------- */

const GearIcon: React.FC<{f: number; at: number}> = ({f, at}) => {
  const rot = (f - at) * 0.8;
  return (
    <svg width={180} height={180} viewBox="-90 -90 180 180">
      <g transform={`rotate(${rot})`}>
        {Array.from({length: 12}, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <rect key={i} x={-7} y={-72} width={14} height={22} fill={G.gold} opacity={0.7} transform={`rotate(${(a * 180) / Math.PI})`} />;
        })}
        <circle r={56} fill="none" stroke={G.goldBright} strokeWidth={3} />
        <circle r={28} fill="none" stroke={G.gold} strokeWidth={2} />
        <circle r={8} fill={G.goldBright} />
      </g>
    </svg>
  );
};

const PriceTagIcon: React.FC<{f: number; at: number; flip: number}> = ({f, at, flip}) => {
  const s = 1 - 0.06 * Math.sin(flip * Math.PI);
  return (
    <svg width={220} height={180} viewBox="0 0 220 180" style={{transform: `scale(${s})`}}>
      <path d="M18 70 L100 18 H200 V118 H100 Z" fill="rgba(30,22,12,0.9)" stroke={G.goldBright} strokeWidth={2} />
      <circle cx={52} cy={68} r={7} fill={G.bg} stroke={G.gold} />
      <text x={130} y={82} textAnchor="middle" fontFamily={GF.num} fontSize={54} fill={G.goldBright}>{flip < 0.5 ? '100' : '30'}</text>
      <text x={130} y={108} textAnchor="middle" fontFamily={GF.cn} fontSize={16} letterSpacing={4} fill={G.ivoryDim}>燃 料 成 本</text>
      <line x1={70} y1={130} x2={200} y2={130} stroke={G.goldLine} />
    </svg>
  );
};

export const SplitScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.split[0];
  const flip = clamp01((f - fb(19)) / 16);
  const eq = clamp01((f - fb(19) - 10) / 20);
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="TWO WAYS TO READ IT" sub="同一个省煤动作，两种算法" />
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity: clamp01((f - at) / 18)}}>
        <div style={{position: 'absolute', left: 180, top: 240, width: 660, height: 470, border: `1px solid ${G.goldFaint}`, background: 'linear-gradient(160deg, rgba(30,22,12,0.55), rgba(3,3,3,0.2))'}} />
        <div style={{position: 'absolute', left: 1080, top: 240, width: 660, height: 470, border: `1px solid ${G.goldLine}`, background: 'linear-gradient(160deg, rgba(48,32,14,0.65), rgba(3,3,3,0.2))'}} />
        <div style={{position: 'absolute', left: 230, top: 300}}><GearIcon f={f} at={at} /></div>
        <div style={{position: 'absolute', left: 1110, top: 290}}><PriceTagIcon f={f} at={at} flip={flip} /></div>
        <div style={{position: 'absolute', left: 430, top: 292, fontFamily: GF.cn, fontSize: 24, letterSpacing: 8, color: G.ivoryDim}}>工程师</div>
        <div style={{position: 'absolute', left: 430, top: 340, fontFamily: GF.cn, fontSize: 88, fontWeight: 900, letterSpacing: 4, ...goldText(0.65)}}>效率 ↑</div>
        <div style={{position: 'absolute', left: 432, top: 470, fontFamily: GF.cn, fontSize: 24, lineHeight: 1.7, color: G.ivory}}>同样一吨煤，<br />做更多的功。</div>
        <div style={{position: 'absolute', left: 1362, top: 250, fontFamily: GF.cn, fontSize: 24, letterSpacing: 8, color: G.ivoryDim}}>生意人</div>
        <div style={{position: 'absolute', left: 1362, top: 300, fontFamily: GF.cn, fontSize: 88, fontWeight: 900, letterSpacing: 4, ...goldText(0.65)}}>价格 ↓</div>
        <div style={{position: 'absolute', left: 1364, top: 430, fontFamily: GF.cn, fontSize: 24, lineHeight: 1.7, color: G.ivory}}>省煤，等于<br />把燃料打折。</div>
        <div style={{position: 'absolute', left: 900, top: 250, width: 1, height: 450, background: `linear-gradient(180deg, rgba(214,180,106,0), ${G.goldLine}, rgba(214,180,106,0))`}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 770, textAlign: 'center', opacity: eq}}>
          <span style={{fontFamily: GF.cn, fontSize: 30, letterSpacing: 4, color: G.ivoryDim}}>省煤 2/3</span>
          <span style={{fontFamily: GF.num, fontSize: 42, color: G.goldBright, margin: '0 28px'}}>=</span>
          <span style={{fontFamily: GF.cn, fontSize: 30, letterSpacing: 4, color: G.ivoryDim}}>燃料成本</span>
          <span style={{fontFamily: GF.num, fontSize: 56, color: G.goldBright, margin: '0 18px'}}>−70%</span>
        </div>
      </div>
      <SourceNote>示意：把每单位功的燃料成本折算成价格；真实的动力价格还包含机器、人工、维护。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 全厂都用得起 ---------------- */

const Factory: React.FC<{x: number; y: number; lit: number; f: number; i: number; s?: number}> = ({x, y, lit, f, i, s = 1}) => {
  const smoke = (f / 2 + i * 17) % 90;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.68 + 0.32 * lit}>
      <polygon points="0,38 54,10 108,38 54,66" fill={`rgba(214,180,106,${0.05 + 0.13 * lit})`} stroke={G.goldLine} strokeWidth={1} />
      <polygon points="0,38 54,66 54,124 0,96" fill="rgba(16,12,8,0.96)" stroke={G.goldLine} strokeWidth={1} />
      <polygon points="108,38 54,66 54,124 108,96" fill="rgba(24,17,10,0.96)" stroke={G.goldLine} strokeWidth={1} />
      <rect x={70} y={-26} width={16} height={50} fill="rgba(10,8,5,0.95)" stroke={G.goldDeep} />
      {Array.from({length: 3}, (_, r) => (
        <g key={r}>
          <rect x={12 + (r % 2) * 8} y={52 + r * 16} width={14} height={8} fill={G.goldBright} opacity={lit * (0.55 + 0.45 * Math.sin(f / 8 + i + r))} />
          <rect x={72} y={86 + r * 11} width={14} height={8} fill={G.goldBright} opacity={lit * (0.5 + 0.5 * Math.sin(f / 9 + i * 2 + r))} />
        </g>
      ))}
      <circle cx={86} cy={-34 - smoke} r={6 + smoke * 0.08} fill={G.ivory} opacity={lit * (1 - smoke / 90) * 0.22} />
    </g>
  );
};

export const AdoptScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.adopt[0];
  const all = f >= fb(24);
  const count = all ? 20 : Math.min(20, 1 + Math.max(0, Math.floor((f - fb(23)) / 6)));
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="AFTER THE PRICE CUT" sub="以前只够抽水，现在全厂都用得起" />
      <div style={{position: 'absolute', left: 120, top: 250, width: 1080, height: 540, opacity: clamp01((f - at) / 20)}}>
        <svg width={1080} height={540}>
          <line x1={60} y1={505} x2={1010} y2={505} stroke={G.goldLine} strokeWidth={1} />
          <ellipse cx={520} cy={510} rx={470} ry={26} fill="rgba(214,180,106,0.06)" />
          {Array.from({length: 20}, (_, i) => (
            <Factory key={i} x={80 + (i % 5) * 195} y={60 + Math.floor(i / 5) * 120} s={0.6} lit={i === 0 || all || f >= fb(23) + i * 6 ? 1 : 0} f={f} i={i} />
          ))}
        </svg>
      </div>
      <div style={{position: 'absolute', left: 1280, top: 300, width: 520, opacity: clamp01((f - at - 10) / 20)}}>
        <div style={{fontFamily: GF.cn, fontSize: 20, letterSpacing: 6, color: G.ivoryDim}}>能负担动力的工厂</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20, marginTop: 8}}>
          <span style={{fontFamily: GF.num, fontSize: 92, ...goldText(0.6)}}>{all ? '×100' : `${count}`}</span>
          <span style={{fontFamily: GF.cn, fontSize: 22, color: G.ivoryDim}}>{all ? '台机器（示意）' : '/ 20 座已亮'}</span>
        </div>
        <div style={{fontFamily: GF.cn, fontSize: 20, color: G.ivoryFaint, marginTop: 18, lineHeight: 1.7}}>
          动力便宜了，<br />机器就不再是奢侈品。
        </div>
        <div style={{position: 'relative', width: 420, height: 6, background: 'rgba(239,230,210,0.1)', marginTop: 28}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(100, (count / 20) * 100)}%`, background: G.goldBright, boxShadow: `0 0 16px ${G.gold}`}} />
        </div>
        <div style={{fontFamily: GF.cn, fontSize: 15, color: G.ivoryFaint, marginTop: 12}}>全部亮起 ≈ ×{MACHINE_MULT} 台（示意）</div>
      </div>
      <SourceNote>示意：工厂数量按「能负担动力」的比例点亮，不是历史统计；表达的是需求扩张的方向。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 反弹效应循环 ---------------- */

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return {x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r};
};
const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  return `M${s.x.toFixed(1)} ${s.y.toFixed(1)} A${r} ${r} 0 0 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
};

export const LoopScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.loop[0];
  const cx = 960;
  const cy = 470;
  const R = 260;
  const nodes = [
    {a: -90, t: '效率 ↑', s: 'same coal, more work'},
    {a: 0, t: '单价 ↓', s: 'power gets cheaper'},
    {a: 90, t: '用量 ↑', s: 'more machines, more uses'},
    {a: 180, t: '总耗 ↑', s: 'the bill goes up'},
  ];
  const pulse = 0.55 + 0.45 * Math.sin(f / 8);
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="REBOUND EFFECT" sub="省下来的，被更大的需求吃掉了" />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={G.goldFaint} strokeWidth={1} />
        <circle cx={cx} cy={cy} r={R - 42} fill="none" stroke={G.goldFaint} strokeWidth={1} strokeDasharray="3 12" />
        {nodes.map((n, i) => {
          const a0 = n.a + 14;
          const a1 = n.a + 76;
          const d = arcPath(cx, cy, R, a0, a1);
          const head = polar(cx, cy, R, a1);
          const hp = polar(cx, cy, R, a1 + 3);
          const o = clamp01((f - at - 10 - i * 10) / 18);
          return (
            <g key={i} opacity={o}>
              <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - o} fill="none" stroke={G.goldBright} strokeWidth={3} style={{filter: `drop-shadow(0 0 8px ${G.gold})`}} />
              <polygon points={`${head.x},${head.y} ${hp.x - 10},${hp.y - 10} ${hp.x + 10},${hp.y + 10}`} fill={G.goldBright} transform={`rotate(${n.a + 75} ${head.x} ${head.y})`} />
            </g>
          );
        })}
        {nodes.map((n, i) => {
          const pt = polar(cx, cy, R + 92, n.a);
          const o = clamp01((f - at - 4 - i * 6) / 16);
          return (
            <g key={i} opacity={o}>
              <circle cx={polar(cx, cy, R, n.a).x} cy={polar(cx, cy, R, n.a).y} r={10} fill={G.bg} stroke={G.goldBright} strokeWidth={2} />
              <circle cx={polar(cx, cy, R, n.a).x} cy={polar(cx, cy, R, n.a).y} r={4} fill={G.goldBright} />
              <text x={pt.x} y={pt.y} textAnchor="middle" fontFamily={GF.cn} fontSize={34} fontWeight={700} fill={G.ivory}>{n.t}</text>
              <text x={pt.x} y={pt.y + 28} textAnchor="middle" fontFamily={GF.latinItalic} fontSize={17} fill={G.ivoryFaint}>{n.s}</text>
            </g>
          );
        })}
        <g opacity={clamp01((f - at - 30) / 30)}>
          {Array.from({length: 9}, (_, i) => {
            const s = 0.8 + rand(i + 300) * 0.6;
            return <polygon key={i} points={coalLump(cx - 26 + (i % 3) * 26, cy + 8 + Math.floor(i / 3) * 18, s, i + 400)} fill="rgba(16,12,8,0.98)" stroke={G.goldDeep} strokeWidth={1} />;
          })}
          <text x={cx} y={cy + 134} textAnchor="middle" fontFamily={GF.num} fontSize={66} fill={G.goldBright} style={{filter: `drop-shadow(0 0 ${16 * pulse}px rgba(214,180,106,0.6))`}}>×{COAL_MULT}</text>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 846, textAlign: 'center', fontFamily: GF.cn, fontSize: 18, letterSpacing: 3, color: G.ivoryFaint, opacity: clamp01((f - at - 30) / 20)}}>
        效率提升 1%，需求可能扩张得更多
      </div>
      <SourceNote>示意：反弹效应（Jevons paradox / rebound effect）。循环不是严格因果链，而是四个方向的相互强化。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 三个现代案例的引子 ---------------- */

const MiniBulb: React.FC = () => (
  <svg width={150} height={130} viewBox="0 0 150 130">
    <circle cx={75} cy={54} r={26} fill="rgba(243,220,160,0.14)" stroke={G.goldBright} strokeWidth={2} />
    <path d="M68 80 V92 H82 V80" fill="none" stroke={G.gold} strokeWidth={2} />
    <path d="M75 40 V54 M75 54 L64 62 M75 54 L86 62" stroke={G.goldBright} strokeWidth={2} fill="none" />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={38 + i * 24} cy={112} r={3} fill={G.goldBright} opacity={0.7} />)}
  </svg>
);
const MiniRoad: React.FC = () => (
  <svg width={150} height={130} viewBox="0 0 150 130">
    <polygon points="42,120 108,120 92,30 58,30" fill="rgba(214,180,106,0.06)" stroke={G.goldLine} />
    <line x1="75" y1="30" x2="75" y2="120" stroke={G.goldBright} strokeWidth={2} strokeDasharray="9 7" />
    <line x1="58" y1="30" x2="55" y2="120" stroke={G.goldLine} strokeDasharray="5 7" />
    <line x1="92" y1="30" x2="95" y2="120" stroke={G.goldLine} strokeDasharray="5 7" />
    {[48, 66, 84, 102].map((y, i) => <rect key={i} x={68 + (i % 2) * 8} y={y} width={10} height={5} fill={G.goldBright} />)}
  </svg>
);
const MiniCloud: React.FC = () => (
  <svg width={150} height={130} viewBox="0 0 150 130">
    <path d="M40 74 Q26 74 26 60 Q26 46 42 46 Q46 24 70 24 Q94 24 98 46 Q118 46 118 62 Q118 76 102 76 Z" fill="rgba(243,220,160,0.08)" stroke={G.goldBright} strokeWidth={2} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={40 + i * 28} y={86} width={20} height={26} fill="rgba(20,15,9,0.9)" stroke={G.goldLine} />
        <circle cx={46 + i * 28} cy={94} r={2} fill={G.goldBright} />
        <circle cx={54 + i * 28} cy={102} r={2} fill={G.goldBright} />
      </g>
    ))}
  </svg>
);

export const ModernScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.modern[0];
  const items = [
    {at: at + 4, x: 210, icon: <MiniBulb />, t: '照 明', s: '−90% 亮度耗电', n: '灯更多'},
    {at: at + 26, x: 750, icon: <MiniRoad />, t: '交 通', s: '4 → 8 车道', n: '路更堵'},
    {at: at + 48, x: 1290, icon: <MiniCloud />, t: '算 力', s: '单价 −80%', n: '账单更高'},
  ];
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="SAME PLAYBOOK, NEW STAGE" sub="同样的剧本，换了三个舞台" />
      {items.map((it, i) => {
        const o = clamp01((f - it.at) / 14);
        return (
          <div key={i} style={{position: 'absolute', left: it.x, top: 280, width: 420, height: 470, opacity: o, transform: `translateY(${(1 - o) * 22}px)`}}>
            <div style={{position: 'absolute', inset: 0, border: `1px solid ${G.goldLine}`, background: 'linear-gradient(160deg, rgba(42,30,15,0.88), rgba(5,4,3,0.35))', boxShadow: 'inset 0 0 80px rgba(214,180,106,0.05)'}} />
            <div style={{position: 'absolute', left: 135, top: 40}}>{it.icon}</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', fontFamily: GF.cn, fontSize: 24, letterSpacing: 10, color: G.ivoryDim}}>{it.t}</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: GF.num, fontSize: 50, ...goldText(0.7)}}>{it.s}</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: GF.cn, fontSize: 28, color: G.ivory}}>{it.n}</div>
            <div style={{position: 'absolute', left: 40, right: 40, bottom: 30, height: 1, background: `linear-gradient(90deg, rgba(214,180,106,0), ${G.goldLine}, rgba(214,180,106,0))`}} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: GF.cn, fontSize: 20, letterSpacing: 8, color: G.ivoryFaint, opacity: clamp01((f - at - 60) / 20)}}>
        省下来的，没有消失，只是换了一个地方花掉
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- LED：灯更多 ---------------- */

const HouseScene: React.FC<{f: number; at: number}> = ({f, at}) => {
  const bulbs: {x: number; y: number; at: number}[] = [];
  for (let i = 0; i <= 10; i++) {
    const u = i / 10;
    bulbs.push({x: 300 + (620 - 300) * u, y: 440 + (300 - 440) * u, at: at + 8 + i * 3});
    bulbs.push({x: 620 + (940 - 620) * u, y: 300 + (440 - 300) * u, at: at + 40 + i * 3});
  }
  return (
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <defs>
        <linearGradient id="jevons-house" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1e11" stopOpacity={0.95} />
          <stop offset="1" stopColor="#0a0704" stopOpacity={0.98} />
        </linearGradient>
        <radialGradient id="jevons-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd99a" stopOpacity={0.55} />
          <stop offset="1" stopColor="#d68a2c" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={620} cy={560} r={360} fill="url(#jevons-warm)" opacity={0.45} />
      <polygon points="300,440 620,300 620,580" fill="url(#jevons-house)" stroke={G.goldLine} strokeWidth={1.5} />
      <polygon points="620,300 940,440 620,580" fill="url(#jevons-house)" stroke={G.goldLine} strokeWidth={1.5} />
      <polygon points="300,440 620,580 620,820 300,680" fill="url(#jevons-house)" stroke={G.goldLine} strokeWidth={1.5} />
      <polygon points="940,440 620,580 620,820 940,680" fill="url(#jevons-house)" stroke={G.goldLine} strokeWidth={1.5} />
      {/* 门与窗 */}
      <polygon points="700,660 800,620 800,760 700,800" fill="rgba(255,214,140,0.14)" stroke={G.goldBright} strokeWidth={1} />
      <polygon points="700,660 750,638 750,780 700,800" fill="rgba(255,214,140,0.26)" />
      <polygon points="800,620 840,640 840,780 800,760" fill="rgba(255,214,140,0.16)" />
      {[0, 1].map((i) => (
        <polygon key={i} points={`370,530 460,570 460,630 370,590`} fill="rgba(255,214,140,0.2)" stroke={G.goldBright} strokeWidth={1} transform={`translate(0 ${i * 100})`} />
      ))}
      {/* 灯带 */}
      <polyline points="300,440 620,300 940,440" fill="none" stroke={G.goldBright} strokeWidth={1.4} opacity={0.5} />
      {bulbs.map((b, i) => {
        const on = clamp01((f - b.at) / 8);
        if (on <= 0) return null;
        return (
          <g key={i} opacity={on}>
            <circle cx={b.x} cy={b.y} r={10 + 5 * on} fill="url(#jevons-warm)" />
            <circle cx={b.x} cy={b.y} r={3.4} fill={G.goldBright} style={{filter: `drop-shadow(0 0 10px ${G.goldBright})`}} />
          </g>
        );
      })}
      {/* 额外的景观灯：庭院里一排小灯 */}
      {Array.from({length: 8}, (_, i) => {
        const on = clamp01((f - at - 55 - i * 3) / 8);
        return (
          <g key={`g${i}`} opacity={on}>
            <line x1={260 + i * 32} y1={760 - i * 4} x2={260 + i * 32} y2={786 - i * 4} stroke={G.goldLine} />
            <circle cx={260 + i * 32} cy={756 - i * 4} r={4.5} fill={G.goldBright} style={{filter: `drop-shadow(0 0 8px ${G.gold})`}} />
          </g>
        );
      })}
    </svg>
  );
};

export const LedScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.led[0];
  const bill = 1 + 1.4 * clamp01((f - at - 10) / (fb(34) - at - 10));
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="LIGHTING · 2020s" sub="灯更省电，灯也更多" />
      <HouseScene f={f} at={at} />
      <div style={{position: 'absolute', left: 1160, top: 300, width: 560, opacity: clamp01((f - at - 6) / 16)}}>
        <div style={{fontFamily: GF.cn, fontSize: 20, letterSpacing: 6, color: G.ivoryDim}}>单位亮度耗电</div>
        <div style={{fontFamily: GF.num, fontSize: 100, lineHeight: 1.1, ...goldText(0.6)}}>−90<span style={{fontSize: 44}}>%</span></div>
        <div style={{height: 1, background: G.goldFaint, margin: '18px 0 26px'}} />
        <div style={{fontFamily: GF.cn, fontSize: 20, letterSpacing: 6, color: G.ivoryDim}}>家里同时亮着的灯</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
          <span style={{fontFamily: GF.num, fontSize: 92, ...goldText(0.65)}}>{bill.toFixed(1)}×</span>
          <span style={{fontFamily: GF.cn, fontSize: 24, color: G.ivoryDim}}>照明总量</span>
        </div>
        <div style={{fontFamily: GF.cn, fontSize: 20, lineHeight: 1.8, color: G.ivory, marginTop: 24}}>
          灯带、氛围灯、通宵景观灯——<br />
          每一盏都更省，加起来更多。
        </div>
      </div>
      <SourceNote>示意：LED 把单位亮度耗电压到约十分之一，但装饰性照明的数量与时长同时上升；家庭照明总电量未必下降。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 高速：四车道变八车道 ---------------- */

export const RoadScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.road[0];
  const widen = easeInOut(clamp01((f - at - 8) / 46));
  const laneN = 4 + 4 * widen;
  const bottomL = 280 - 90 * widen;
  const bottomR = 920 + 90 * widen;
  const topL = 548 - 26 * widen;
  const topR = 652 + 26 * widen;
  const cars = Array.from({length: 40}, (_, i) => {
    const lane8 = Math.floor(rand(i + 1) * 8);
    if (lane8 >= laneN) return null;
    const speed = 0.0012 + rand(i + 7) * 0.0016;
    const dir = rand(i + 11) > 0.5 ? 1 : -1;
    const t = ((f * speed * dir + rand(i + 21)) % 1 + 1) % 1;
    const u = i / laneN;
    const xb = bottomL + (bottomR - bottomL) * ((lane8 + 0.5) / laneN);
    const xt = topL + (topR - topL) * ((lane8 + 0.5) / laneN);
    const x = xb + (xt - xb) * t;
    const y = 650 - 500 * t;
    return {x, y, s: 0.3 + 0.9 * t, dir, lane: lane8, t, u};
  }).filter(Boolean) as {x: number; y: number; s: number; dir: number; lane: number; t: number; u: number}[];
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="TRAFFIC · INDUCED DEMAND" sub="路修宽了，车也变多了" />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="jevons-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a0a0a" />
            <stop offset="1" stopColor="#1a140c" />
          </linearGradient>
          <radialGradient id="jevons-city" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#d6b46a" stopOpacity={0.3} />
            <stop offset="1" stopColor="#d6b46a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#jevons-road)" opacity={0.5} />
        <ellipse cx={960} cy={160} rx={620} ry={120} fill="url(#jevons-city)" />
        {/* 天际线 */}
        {Array.from({length: 34}, (_, i) => {
          const x = 280 + i * 40;
          const h = 30 + rand(i + 5) * 90;
          return (
            <g key={i}>
              <rect x={x} y={160 - h} width={30} height={h} fill="#0b0906" stroke="rgba(214,180,106,0.1)" />
              {Array.from({length: Math.floor(h / 18)}, (_, j) => (
                <rect key={j} x={x + 6 + (j % 2) * 10} y={160 - h + 10 + j * 16} width={4} height={4} fill={G.goldBright} opacity={0.18 + rand(i * 10 + j) * 0.35} />
              ))}
            </g>
          );
        })}
        <polygon points={`${bottomL},650 ${bottomR},650 ${topR},150 ${topL},150`} fill="#0d0c0a" stroke={G.goldLine} strokeWidth={1.2} />
        {Array.from({length: 8}, (_, i) => {
          const k = i + 1;
          if (k >= laneN) return null;
          const xb = bottomL + (bottomR - bottomL) * (k / laneN);
          const xt = topL + (topR - topL) * (k / laneN);
          const o = k === 4 || k === 5 ? widen : 1;
          return <line key={i} x1={xb} y1={650} x2={xt} y2={150} stroke={k === Math.floor(laneN / 2) ? G.goldBright : G.goldLine} strokeWidth={k === Math.floor(laneN / 2) ? 2 : 1} strokeDasharray="16 18" opacity={0.35 + 0.6 * o} />;
        })}
        {/* 车流 */}
        {cars.map((c, i) => (
          <g key={i} opacity={0.25 + 0.7 * clamp01(c.t * 2)}>
            <rect x={c.x - 7 * c.s} y={c.y - 3 * c.s} width={22 * c.s} height={9 * c.s} fill={c.dir > 0 ? G.goldBright : G.ivory} opacity={0.8} />
            <circle cx={c.x - 5 * c.s} cy={c.y + 3 * c.s} r={2.4 * c.s} fill={c.dir > 0 ? G.red : G.goldBright} />
            <circle cx={c.x + 5 * c.s} cy={c.y + 3 * c.s} r={2.4 * c.s} fill={c.dir > 0 ? G.red : G.goldBright} />
          </g>
        ))}
        <g opacity={0.95}>
          <text x={230} y={250} fontFamily={GF.num} fontSize={92} fill={G.goldBright} opacity={1 - 0.55 * widen}>4</text>
          <line x1={300} y1={214} x2={300 + 130 * widen} y2={214} stroke={G.goldBright} strokeWidth={2} opacity={0.5} />
          <polygon points={`${300 + 140 * widen},214 ${300 + 125 * widen},206 ${300 + 125 * widen},222`} fill={G.goldBright} opacity={0.7 * widen} />
          <text x={450} y={250} fontFamily={GF.num} fontSize={92} fill={G.goldBright} opacity={0.35 + 0.65 * widen}>8</text>
          <text x={230} y={300} fontFamily={GF.cn} fontSize={24} letterSpacing={6} fill={G.ivoryDim}>车 道 · {Math.round(laneN)} 条</text>
        </g>
        <text x={1480} y={300} textAnchor="end" fontFamily={GF.cn} fontSize={66} fontWeight={700} fill={G.ivory}>更堵</text>
        <text x={1480} y={348} textAnchor="end" fontFamily={GF.latinItalic} fontSize={24} fill={G.ivoryDim}>induced demand</text>
      </svg>
      <SourceNote>示意：车道扩容会降低出行的时间成本，诱发新的出行与更远的居住选择；高峰拥堵可能回到甚至超过原来的水平。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 云：单价跌，总账单涨 ---------------- */

const Rack: React.FC<{x: number; y: number; f: number; i: number}> = ({x, y, f, i}) => (
  <g transform={`translate(${x} ${y})`}>
    <polygon points="0,18 60,0 120,18 60,36" fill="rgba(214,180,106,0.08)" stroke={G.goldLine} />
    <polygon points="0,18 60,36 60,190 0,172" fill="rgba(13,10,6,0.96)" stroke={G.goldLine} />
    <polygon points="120,18 60,36 60,190 120,172" fill="rgba(22,16,9,0.96)" stroke={G.goldLine} />
    {Array.from({length: 9}, (_, j) => (
      <g key={j}>
        <rect x={10} y={44 + j * 14} width={36} height={5} fill="rgba(239,230,210,0.1)" />
        <circle cx={54} cy={46 + j * 14} r={2.4} fill={G.goldBright} opacity={0.25 + 0.75 * Math.abs(Math.sin(f / (6 + (i % 4) * 3) + j + i))} />
      </g>
    ))}
  </g>
);

export const CloudScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.cloud[0];
  const bill = 1 + 2.5 * clamp01((f - at - 20) / (fb(40) - at - 20));
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="CLOUD · 2010s" sub="单价跌了，总账单反而涨了" />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="jevons-cloud" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#d6b46a" stopOpacity={0.34} />
            <stop offset="1" stopColor="#d6b46a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={640} cy={500} rx={520} ry={360} fill="url(#jevons-cloud)" />
        <ellipse cx={640} cy={790} rx={430} ry={80} fill="url(#jevons-cloud)" opacity={0.8} />
        {Array.from({length: 3}, (_, row) =>
          Array.from({length: 4}, (_, col) => <Rack key={`${row}-${col}`} x={220 + col * 170} y={330 + row * 150} f={f} i={row * 4 + col} />),
        )}
        {/* 云 */}
        <path d="M400 200 Q370 200 370 172 Q370 142 404 142 Q414 104 458 104 Q506 104 516 142 Q560 142 560 176 Q560 204 524 204 Z" fill="none" stroke={G.goldBright} strokeWidth={2} opacity={0.7} />
        {Array.from({length: 48}, (_, i) => {
          const x = 400 + rand(i + 70) * 480;
          const y = 170 + ((f * (1.2 + rand(i + 80) * 1.8) + rand(i + 90) * 300) % 420);
          return <circle key={i} cx={x} cy={y} r={2 + rand(i + 100) * 2.4} fill={G.goldBright} opacity={0.35 + 0.55 * rand(i + 110)} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 1120, top: 300, width: 620, opacity: clamp01((f - at - 10) / 16)}}>
        <div style={{fontFamily: GF.cn, fontSize: 20, letterSpacing: 6, color: G.ivoryDim}}>单位存储 / 计算价格</div>
        <div style={{fontFamily: GF.num, fontSize: 88, lineHeight: 1.1, ...goldText(0.55)}}>−80<span style={{fontSize: 40}}>%</span></div>
        <div style={{height: 1, background: G.goldFaint, margin: '20px 0 24px'}} />
        <div style={{fontFamily: GF.cn, fontSize: 20, letterSpacing: 6, color: G.ivoryDim}}>企业总账单</div>
        <div style={{fontFamily: GF.num, fontSize: 110, lineHeight: 1.1, ...goldText(0.8)}}>{bill.toFixed(1)}×</div>
        <svg width={440} height={110} style={{marginTop: 10}}>
          <path d={`M0 100 L80 92 L150 84 L220 60 L300 48 L380 20 L440 6`} fill="none" stroke={G.goldBright} strokeWidth={2.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01((f - at - 24) / 40)} style={{filter: `drop-shadow(0 0 8px ${G.gold})`}} />
        </svg>
        <div style={{fontFamily: GF.cn, fontSize: 20, lineHeight: 1.8, color: G.ivory, marginTop: 18}}>
          每一次滑动、每一秒停留，<br />
          都变成了要存下来、跑算法的数据。
        </div>
      </div>
      <SourceNote>示意：云计算单价下降，但存储、调用与算法需求同步扩张；总账单的方向由需求弹性决定，不是必然上涨。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 2025：模型价格与英伟达 ---------------- */

export const PriceScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.price[0];
  const grow = clamp01((f - at - 6) / 30);
  const line = clamp01((f - fr(43.0)) / 46);
  const o1h = 420 * grow;
  const r1h = (R1_PRICE / O1_PRICE) * 420 * grow;
  const pts = [
    [0, 0.92], [0.12, 0.84], [0.2, 0.88], [0.32, 0.68], [0.42, 0.74], [0.52, 0.52], [0.6, 0.58], [0.7, 0.3], [0.8, 0.38], [0.9, 0.2], [1, 0.26],
  ];
  let d = '';
  const n = Math.max(2, Math.floor(pts.length * line));
  for (let i = 0; i < n; i++) {
    d += `${i === 0 ? 'M' : 'L'}${(20 + pts[i][0] * 620).toFixed(1)} ${(230 + (1 - pts[i][1]) * 390).toFixed(1)}`;
  }
  return (
    <AbsoluteFill>
      <YearHeader f={f} at={at} year="2025" caption="纽约 · 1 月 27 日" />
      <SceneLabel f={f} at={at + 4} text="THE DEEPSEEK MOMENT" sub="每百万输出 token 的价格" x={1420} y={40} />
      <div style={{position: 'absolute', left: 300, top: 250, width: 700, height: 560, opacity: clamp01((f - at) / 16)}}>
        <svg width={700} height={560} style={{position: 'absolute'}}>
          <line x1={60} y1={510} x2={640} y2={510} stroke={G.goldLine} />
          <rect x={130} y={510 - o1h} width={150} height={o1h} fill="rgba(214,180,106,0.16)" stroke={G.goldLine} />
          <rect x={420} y={510 - r1h} width={150} height={r1h} fill="rgba(243,220,160,0.28)" stroke={G.goldBright} style={{filter: `drop-shadow(0 0 14px rgba(214,180,106,0.45))`}} />
          <text x={205} y={510 - o1h - 18} textAnchor="middle" fontFamily={GF.num} fontSize={40} fill={G.ivoryDim}>${O1_PRICE}</text>
          <text x={495} y={510 - r1h - 18} textAnchor="middle" fontFamily={GF.num} fontSize={40} fill={G.goldBright}>${R1_PRICE}</text>
          <text x={205} y={548} textAnchor="middle" fontFamily={GF.cn} fontSize={20} fill={G.ivoryDim}>OpenAI o1</text>
          <text x={495} y={548} textAnchor="middle" fontFamily={GF.cn} fontSize={20} fill={G.ivory}>DeepSeek R1</text>
        </svg>
        <div style={{position: 'absolute', left: 560, top: 260, fontFamily: GF.num, fontSize: 78, ...goldText(0.7)}}>1/{PRICE_RATIO}</div>
        <div style={{position: 'absolute', left: 562, top: 345, fontFamily: GF.cn, fontSize: 18, letterSpacing: 3, color: G.ivoryDim}}>价格比</div>
      </div>
      <div style={{position: 'absolute', left: 1060, top: 250, width: 700, height: 500, opacity: clamp01((f - at - 20) / 20)}}>
        <svg width={700} height={500} style={{overflow: 'visible'}}>
          <line x1={0} y1={390} x2={660} y2={390} stroke={G.goldFaint} />
          <path d={d} fill="none" stroke={G.red} strokeWidth={2.4} style={{filter: `drop-shadow(0 0 8px rgba(200,81,60,0.5))`}} />
          {line > 0.05 ? <circle cx={20 + pts[n - 1][0] * 620} cy={230 + (1 - pts[n - 1][1]) * 390} r={7} fill={G.red} /> : null}
        </svg>
        <div style={{position: 'absolute', left: 40, top: 80, fontFamily: GF.num, fontSize: 104, color: G.red, textShadow: '0 0 24px rgba(200,81,60,0.4)'}}>−{NVDA_DROP_PCT}<span style={{fontSize: 46}}>%</span></div>
        <div style={{position: 'absolute', left: 52, top: 200, fontFamily: GF.cn, fontSize: 22, color: G.ivoryDim}}>单日跌幅</div>
        <div style={{position: 'absolute', left: 330, top: 100, fontFamily: GF.num, fontSize: 64, fill: G.ivory, color: G.ivory}}>−${NVDA_LOSS_B}B</div>
        <div style={{position: 'absolute', left: 334, top: 182, fontFamily: GF.cn, fontSize: 22, color: G.ivoryDim}}>市值蒸发</div>
        <div style={{position: 'absolute', left: 0, top: 420, fontFamily: GF.cn, fontSize: 20, lineHeight: 1.7, color: G.ivory}}>
          市场以为：模型便宜了，<br />算力就不需要那么多了。
        </div>
      </div>
      <SourceNote>数据：2025-01-27 英伟达单日跌约 17%、市值蒸发约 6000 亿美元；价格来自 OpenAI o1（$60）与 DeepSeek R1（$2.19）每百万输出 token 的公开定价。股价曲线为示意，不是逐笔行情。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- AI 接进每张表格 ---------------- */

const AiIconTile: React.FC<{kind: number; lit: number}> = ({kind, lit}) => {
  const c = lit > 0.5 ? G.goldBright : G.goldLine;
  return (
    <svg width={60} height={60} viewBox="0 0 60 60">
      {kind % 6 === 0 ? <><rect x={8} y={12} width={44} height={32} rx={4} fill="none" stroke={c} /><path d="M16 22 H44 M16 30 H38 M16 38 H30" stroke={c} /></> : null}
      {kind % 6 === 1 ? <><rect x={8} y={10} width={44} height={40} fill="none" stroke={c} /><path d="M8 22 H52 M24 10 V50 M36 10 V50" stroke={c} /></> : null}
      {kind % 6 === 2 ? <><path d="M20 16 L10 30 L20 44 M40 16 L50 30 L40 44 M34 12 L26 48" fill="none" stroke={c} strokeWidth={2} /></> : null}
      {kind % 6 === 3 ? <><path d="M14 10 H40 L48 18 V50 H14 Z" fill="none" stroke={c} /><path d="M40 10 V18 H48" fill="none" stroke={c} /></> : null}
      {kind % 6 === 4 ? <><circle cx={30} cy={30} r={14} fill="none" stroke={c} /><path d="M30 16 V44 M16 30 H44" stroke={c} /></> : null}
      {kind % 6 === 5 ? <><path d="M12 22 Q12 14 22 14 H38 Q48 14 48 22 V38 Q48 46 38 46 H26 L18 52 V46 H22 Q12 46 12 38 Z" fill="none" stroke={c} /></> : null}
    </svg>
  );
};

export const AiScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.ai[0];
  const cells = ['客服', '表格', '代码', '文档', '图片', '语音', '搜索', 'Agent', '合同', '报表', '翻译', '运营'];
  const curve = clamp01((f - at - 20) / 70);
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="AI · 2025" sub="价格一跌，接进了每一张表格" />
      <div style={{position: 'absolute', left: 170, top: 270, width: 820, opacity: clamp01((f - at) / 18)}}>
        {cells.map((name, i) => {
          const lit = clamp01((f - at - 6 - i * 4) / 8);
          return (
            <div key={i} style={{position: 'absolute', left: (i % 4) * 205, top: Math.floor(i / 4) * 145, width: 190, height: 130, border: `1px solid ${lit > 0.5 ? G.goldLine : G.goldFaint}`, background: `rgba(24,18,10,${0.25 + 0.4 * lit})`}}>
              <div style={{position: 'absolute', left: 16, top: 18, opacity: 0.35 + 0.65 * lit}}><AiIconTile kind={i} lit={lit} /></div>
              <div style={{position: 'absolute', left: 88, top: 46, fontFamily: GF.cn, fontSize: 22, letterSpacing: 2, color: lit > 0.5 ? G.ivory : G.ivoryFaint}}>{name}</div>
              <div style={{position: 'absolute', left: 0, bottom: 0, height: 2, width: `${lit * 100}%`, background: G.goldBright, boxShadow: `0 0 8px ${G.gold}`}} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 1080, top: 260, width: 700, height: 520, opacity: clamp01((f - at) / 20)}}>
        <div style={{fontFamily: GF.cn, fontSize: 20, letterSpacing: 6, color: G.ivoryDim}}>API 调用量 / 算力消耗</div>
        <svg width={660} height={390} style={{marginTop: 18, overflow: 'visible'}}>
          <line x1={0} y1={350} x2={640} y2={350} stroke={G.goldFaint} />
          <line x1={0} y1={350} x2={0} y2={20} stroke={G.goldFaint} />
          <path d={`M0 340 C120 338 220 330 320 300 C420 268 500 190 570 80 L640 24`} fill="none" stroke={G.goldBright} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - curve} style={{filter: `drop-shadow(0 0 10px ${G.gold})`}} />
          {curve > 0.2 ? <circle cx={640} cy={24} r={7} fill={G.goldBright} style={{filter: `drop-shadow(0 0 16px ${G.goldBright})`}} /> : null}
          <text x={620} y={16} textAnchor="end" fontFamily={GF.cn} fontSize={22} fill={G.goldBright}>指数级</text>
        </svg>
        <div style={{position: 'absolute', left: 0, top: 430, display: 'flex', gap: 42, fontFamily: GF.cn, fontSize: 20, color: G.ivoryDim}}>
          <span>调用量 <span style={{fontFamily: GF.num, fontSize: 32, color: G.goldBright}}>↑↑</span></span>
          <span>算力 <span style={{fontFamily: GF.num, fontSize: 32, color: G.goldBright}}>↑↑</span></span>
          <span>电力 <span style={{fontFamily: GF.num, fontSize: 32, color: G.goldBright}}>↑↑</span></span>
        </div>
        <div style={{fontFamily: GF.cn, fontSize: 19, lineHeight: 1.8, color: G.ivory, marginTop: 78}}>
          当一次调用便宜到可以忽略，<br />
          它就会被塞进每一个流程里。
        </div>
      </div>
      <SourceNote>示意：价格下降会扩大使用场景，调用量、算力与电力消耗的方向性变化；具体倍数取决于模型效率与需求弹性。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 没有巨头靠省总预算成功 ---------------- */

export const GiantScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.giant[0];
  const hit = clamp01((f - fb(51)) / 10);
  const swing = clamp01((f - fb(51) + 14) / 14);
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="THE UNIT-PRICE GAME" sub="没有巨头靠替客户省总预算成功" />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="jevons-scale-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#d6b46a" stopOpacity={0.34} />
            <stop offset="1" stopColor="#d6b46a" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="jevons-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={G.goldDeep} />
            <stop offset="0.5" stopColor={G.goldBright} />
            <stop offset="1" stopColor={G.goldDeep} />
          </linearGradient>
        </defs>
        {/* 天平 */}
        <ellipse cx={640} cy={600} rx={380} ry={250} fill="url(#jevons-scale-glow)" />
        <g opacity={1 - hit * 0.7}>
          <path d="M560 820 L640 500 L720 820" fill="none" stroke={G.goldDeep} strokeWidth={8} />
          <path d="M470 820 H810" stroke={G.goldLine} strokeWidth={2} />
          <g transform="rotate(9 640 500)">
            <line x1={380} y1={500} x2={900} y2={500} stroke={G.goldBright} strokeWidth={10} strokeLinecap="round" />
            <circle cx={640} cy={500} r={14} fill={G.goldBright} />
            {[380, 900].map((x, i) => (
              <g key={i}>
                <line x1={x} y1={500} x2={x} y2={590} stroke={G.goldLine} strokeWidth={1} />
                <path d={`M${x - 90} 590 Q${x} 660 ${x + 90} 590 Z`} fill="rgba(214,180,106,0.08)" stroke={G.goldLine} />
                {i === 0 ? (
                  <g>
                    <circle cx={x} cy={570} r={22} fill="rgba(214,180,106,0.25)" stroke={G.goldBright} />
                    <text x={x} y={540} textAnchor="middle" fontFamily={GF.cn} fontSize={19} fill={G.gold}>省下的预算</text>
                  </g>
                ) : (
                  <g>
                    {Array.from({length: 7}, (_, j) => (
                      <ellipse key={j} cx={x} cy={628 - j * 14} rx={34} ry={9} fill="rgba(214,180,106,0.2)" stroke={G.goldBright} strokeWidth={1} />
                    ))}
                    <text x={x} y={540} textAnchor="middle" fontFamily={GF.cn} fontSize={19} fill={G.gold}>总账单</text>
                  </g>
                )}
              </g>
            ))}
          </g>
        </g>
        {/* 价格牌 */}
        <g opacity={1 - clamp01((f - fb(51) - 26) / 14)}>
          <rect x={1240} y={330} width={360} height={230} fill="rgba(30,22,12,0.96)" stroke={G.goldBright} strokeWidth={2} />
          <circle cx={1275} cy={365} r={7} fill={G.bg} stroke={G.gold} />
          <text x={1420} y={430} textAnchor="middle" fontFamily={GF.cn} fontSize={82} fontWeight={900} fill={G.goldBright}>单价</text>
          <text x={1420} y={485} textAnchor="middle" fontFamily={GF.cn} fontSize={20} letterSpacing={5} fill={G.ivoryDim}>UNIT PRICE</text>
          <text x={1420} y={530} textAnchor="middle" fontFamily={GF.cn} fontSize={18} fill={G.ivoryFaint}>打穿它，换规模</text>
        </g>
        {/* 锤子 */}
        <g transform={`rotate(${-56 + swing * 82} 1510 250)`} opacity={clamp01((f - fb(51) + 10) / 8)}>
          <rect x={1496} y={120} width={20} height={250} fill="rgba(214,180,106,0.5)" stroke={G.gold} />
          <rect x={1450} y={90} width={112} height={54} fill="rgba(214,180,106,0.22)" stroke={G.goldBright} strokeWidth={2} />
        </g>
        {/* 碎片 */}
        {Array.from({length: 18}, (_, i) => {
          const t = clamp01((f - fb(51) - 6 - i * 0.4) / 30);
          if (t <= 0) return null;
          const a = rand(i + 500) * Math.PI * 2;
          const d = 40 + 220 * t;
          return <polygon key={i} points="0,0 12,4 7,14" fill={i % 3 === 0 ? G.red : G.goldBright} opacity={(1 - t) * 0.8} transform={`translate(${1430 + Math.cos(a) * d} ${420 + Math.sin(a) * d * 0.6}) rotate(${t * 360 + i * 20})`} />;
        })}
        <text x={1010} y={300} textAnchor="middle" fontFamily={GF.cn} fontSize={40} fill={G.ivory} opacity={clamp01((f - fb(51) - 16) / 12)}>不是省预算</text>
        <text x={1010} y={380} textAnchor="middle" fontFamily={GF.cn} fontSize={64} fontWeight={900} fill={G.goldBright} opacity={clamp01((f - fb(51) - 24) / 12)}>是打穿单价</text>
      </svg>
      <div style={{position: 'absolute', left: 1250, top: 650, opacity: clamp01((f - fb(51) - 24) / 10)}}>
        <div style={{width: 320, height: 100, border: `3px solid ${G.sealRed}`, color: G.sealRed, fontFamily: GF.cn, fontWeight: 900, fontSize: 42, letterSpacing: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-9deg)', opacity: 0.85}}>打穿</div>
      </div>
      <SourceNote>示意：用更低的单价换更大的规模，是平台型公司的常见策略；不是每家公司都能靠它成功。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 门槛降低：越省越多 ---------------- */

export const GateScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.gate[0];
  const open = clamp01((f - fb(54)) / 20);
  const fadeGate = 1 - clamp01((f - fb(55.4)) / 18);
  const anchor = clamp01((f - at) / 20);
  const clock = clamp01((f - fb(55.6)) / 18);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', opacity: anchor * (1 - clock), transform: `translateY(${(1 - anchor) * 18}px)`}}>
        <span style={{fontFamily: GF.cn, fontWeight: 900, fontSize: 128, letterSpacing: 18, ...goldText(1)}}>越省越多</span>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute'}} opacity={fadeGate}>
        <defs>
          <radialGradient id="jevons-gate" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f3dca0" stopOpacity={0.3} />
            <stop offset="1" stopColor="#d6b46a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={960} cy={600} r={380} fill="url(#jevons-gate)" opacity={0.9} />
        <ellipse cx={960} cy={680} rx={200} ry={240} fill="url(#jevons-gate)" opacity={0.85} />
        {/* 门柱 */}
        <rect x={700} y={500} width={52} height={320} fill="rgba(24,18,10,0.96)" stroke={G.goldBright} strokeWidth={1.8} />
        <rect x={1168} y={500} width={52} height={320} fill="rgba(24,18,10,0.96)" stroke={G.goldBright} strokeWidth={1.8} />
        <path d="M700 500 Q960 340 1220 500" fill="none" stroke={G.goldBright} strokeWidth={3} />
        <path d="M726 500 Q960 370 1194 500" fill="none" stroke={G.goldLine} />
        {/* 门扇 */}
        <rect x={752 - open * 180} y={530} width={196} height={290} fill="rgba(18,13,8,0.97)" stroke={G.gold} />
        <rect x={972 + open * 180} y={530} width={196} height={290} fill="rgba(18,13,8,0.97)" stroke={G.gold} />
        {/* 门槛 */}
        <line x1={752} y1={820} x2={1168} y2={820} stroke={G.goldBright} strokeWidth={2} />
        {/* 人群 */}
        {Array.from({length: 70}, (_, i) => {
          const t = clamp01((f - fb(54) - 4 - rand(i + 600) * 18) / 34);
          if (t <= 0) return null;
          const sx = 860 + rand(i + 610) * 200;
          const tx = 940 + rand(i + 620) * 620;
          const x = sx + (tx - sx) * t;
          const y = 800 + rand(i + 630) * 70 - t * 20;
          return <circle key={i} cx={x} cy={y} r={2 + rand(i + 640) * 4} fill={G.goldBright} opacity={0.25 + 0.6 * rand(i + 650)} />;
        })}
      </svg>
      {/* 时钟 */}
      <div style={{position: 'absolute', left: 760, top: 340, width: 400, height: 400, opacity: clock}}>
        <svg width={400} height={400} viewBox="0 0 400 400">
          <circle cx={200} cy={200} r={168} fill="rgba(3,3,3,0.9)" stroke={G.goldLine} strokeWidth={1.5} />
          <circle cx={200} cy={200} r={150} fill="none" stroke={G.goldFaint} strokeWidth={1} strokeDasharray="2 8" />
          {Array.from({length: 12}, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={200 + Math.cos(a) * 156} y1={200 + Math.sin(a) * 156} x2={200 + Math.cos(a) * 168} y2={200 + Math.sin(a) * 168} stroke={G.gold} strokeWidth={i % 3 === 0 ? 3 : 1} />;
          })}
          <line x1={200} y1={200} x2={200 + Math.cos(-Math.PI / 3 + f * 0.02) * 96} y2={200 + Math.sin(-Math.PI / 3 + f * 0.02) * 96} stroke={G.goldBright} strokeWidth={4} />
          <line x1={200} y1={200} x2={200 + Math.cos(Math.PI / 2 + f * 0.006) * 130} y2={200 + Math.sin(Math.PI / 2 + f * 0.006) * 130} stroke={G.ivory} strokeWidth={2} />
          <circle cx={200} cy={200} r={9} fill={G.goldBright} style={{filter: `drop-shadow(0 0 12px ${G.gold})`}} />
        </svg>
      </div>
      <SourceNote>示意：门槛降低后，新增用户与新增用量会一起进来；省下来的资源会被系统重新定价。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 结尾 ---------------- */

export const EndScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.end[0];
  const o = clamp01((f - at) / 26);
  const pulse = 0.7 + 0.3 * Math.sin(f / 12);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 960 - 260, top: 540 - 260, width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, rgba(243,220,160,${0.16 * pulse}) 0%, rgba(243,220,160,0.04) 45%, rgba(0,0,0,0) 70%)`}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <circle cx={960} cy={540} r={210} fill="none" stroke={G.goldFaint} strokeWidth={1} opacity={o} />
        <circle cx={960} cy={540} r={4} fill={G.goldBright} style={{filter: `drop-shadow(0 0 18px ${G.goldBright})`}} opacity={o} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 315, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 16}px)`}}>
        <span style={{fontFamily: GF.cn, fontWeight: 900, fontSize: 150, letterSpacing: 22, filter: 'drop-shadow(0 0 34px rgba(243,220,160,0.32))', ...goldText(1)}}>越省越多</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 512, textAlign: 'center', fontFamily: GF.latin, fontSize: 22, letterSpacing: 14, color: G.ivoryDim, opacity: o}}>THE JEVONS PARADOX</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', fontFamily: GF.cn, fontSize: 42, letterSpacing: 4, color: G.ivory, opacity: clamp01((f - at - 18) / 20)}}>{FINAL_QUESTION}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 684, textAlign: 'center', fontFamily: GF.latinItalic, fontSize: 25, color: G.ivoryDim, opacity: clamp01((f - at - 24) / 20)}}>Where did your saved time go?</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 754, textAlign: 'center', fontFamily: GF.cn, fontSize: 20, letterSpacing: 6, color: G.ivoryDim, opacity: clamp01((f - at - 40) / 24)}}>评论区聊聊</div>
    </AbsoluteFill>
  );
};

/* ---------------- 5 分钟版：无纸化 / 带宽 / 办公软件 ---------------- */

const MiniPanel: React.FC<{x: number; y: number; w?: number; h?: number; label: string; stat: string; active: number; children: React.ReactNode}> = ({x, y, w = 470, h = 500, label, stat, active, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: 0.35 + 0.65 * active, border: `1px solid ${active > 0.5 ? G.goldLine : G.goldFaint}`, background: 'linear-gradient(160deg, rgba(34,24,12,0.82), rgba(3,3,3,0.3))', boxShadow: active > 0.5 ? 'inset 0 0 70px rgba(214,180,106,0.06)' : undefined}}>
    <div style={{position: 'absolute', left: 26, top: 22, fontFamily: GF.cn, fontSize: 19, letterSpacing: 5, color: G.ivoryDim}}>{label}</div>
    <div style={{position: 'absolute', left: 26, bottom: 28, fontFamily: GF.num, fontSize: 76, lineHeight: 1, ...goldText(active > 0.5 ? 0.65 : 0.2)}}>{stat}</div>
    <div style={{position: 'absolute', left: 26, right: 26, top: 70, bottom: 120}}>{children}</div>
  </div>
);

export const Modern2Scene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.modern2[0];
  const paper = clamp01((f - fb(57)) / 12);
  const band = clamp01((f - fb(61)) / 12);
  const office = clamp01((f - fb(65)) / 12);
  const all = clamp01((f - fb(69)) / 12);
  const sheets = 1 + Math.round(2 * clamp01((f - fb(57)) / 30));
  const pipe = 90 + 250 * clamp01((f - fb(61)) / 38);
  const versions = 1 + Math.round(9 * clamp01((f - fb(65)) / 32));
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="SAME PLAYBOOK · THREE MORE STAGES" sub="同一套剧本，换了三个舞台" />
      <MiniPanel x={130} y={235} label="PAPERLESS · 1975—NOW" stat={`×${sheets}`} active={Math.max(paper, all)}>
        <svg width={420} height={300} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={20} y={190} width={360} height={16} fill="rgba(214,180,106,0.12)" stroke={G.goldLine} />
          <rect x={54} y={110} width={110} height={70} fill="rgba(20,15,9,0.9)" stroke={G.goldLine} />
          <rect x={70} y={84} width={78} height={28} fill="rgba(214,180,106,0.08)" stroke={G.gold} />
          <rect x={86} y={132} width={44} height={8} fill={G.goldBright} opacity={0.7} />
          {Array.from({length: 6}, (_, i) => (
            <rect key={i} x={220 + (i % 3) * 10} y={70 + i * 12} width={110} height={14} fill="rgba(239,230,210,0.06)" stroke={G.goldFaint} />
          ))}
          {Array.from({length: sheets}, (_, i) => (
            <rect key={`s${i}`} x={214 + i * 14} y={60 + i * 10} width={118} height={150} fill="rgba(239,230,210,0.06)" stroke={G.goldLine} />
          ))}
          <path d="M174 150 Q196 130 214 150" fill="none" stroke={G.goldBright} strokeWidth={1.4} strokeDasharray="5 6" />
        </svg>
      </MiniPanel>

      <MiniPanel x={725} y={235} label="BANDWIDTH · 2000s" stat="4K" active={Math.max(band, all)}>
        <svg width={420} height={300} style={{position: 'absolute', left: 0, top: 0}}>
          <line x1={20} y1={150} x2={400} y2={150} stroke={G.goldFaint} strokeWidth={2} />
          <line x1={20} y1={112} x2={20 + pipe} y2={112} stroke={G.goldBright} strokeWidth={2} />
          <line x1={20} y1={188} x2={20 + pipe} y2={188} stroke={G.goldBright} strokeWidth={2} />
          <rect x={34} y={128} width={72} height={46} fill="rgba(239,230,210,0.06)" stroke={G.goldLine} />
          <text x={70} y={156} textAnchor="middle" fontFamily={GF.latin} fontSize={15} fill={G.ivoryDim}>TEXT</text>
          <rect x={20 + pipe + 14} y={116} width={86} height={68} fill="rgba(214,180,106,0.08)" stroke={G.goldBright} />
          <text x={20 + pipe + 57} y={158} textAnchor="middle" fontFamily={GF.num} fontSize={28} fill={G.goldBright}>4K</text>
          {Array.from({length: 22}, (_, i) => {
            const u = ((f * 0.0022 + i * 0.06) % 1 + 1) % 1;
            return <circle key={i} cx={30 + u * (pipe + 60)} cy={132 + Math.sin(i) * 16} r={2.4} fill={G.goldBright} opacity={0.35 + 0.4 * Math.sin(i + f / 8)} />;
          })}
        </svg>
      </MiniPanel>

      <MiniPanel x={1320} y={235} label="OFFICE · AI" stat={`×${versions}`} active={Math.max(office, all)}>
        <svg width={420} height={300} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={22} y={60} width={120} height={150} fill="rgba(239,230,210,0.07)" stroke={G.goldBright} />
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={38} y1={84 + i * 18} x2={i === 4 ? 100 : 124} y2={84 + i * 18} stroke={G.ivoryDim} opacity={0.55} />)}
          <text x={82} y={192} textAnchor="middle" fontFamily={GF.cn} fontSize={14} fill={G.goldBright}>定稿</text>
          {Array.from({length: versions - 1}, (_, i) => (
            <rect key={i} x={168 + (i % 5) * 42} y={54 + Math.floor(i / 5) * 70} width={34} height={56} fill="rgba(214,180,106,0.08)" stroke={G.goldLine} transform={`rotate(${(i % 3 - 1) * 4} ${185 + (i % 5) * 42} ${82 + Math.floor(i / 5) * 70})`} />
          ))}
          <circle cx={350} cy={84} r={30} fill="none" stroke={G.gold} />
          <line x1={350} y1={84} x2={350} y2={64} stroke={G.goldBright} strokeWidth={2} />
          <line x1={350} y1={84} x2={366} y2={92} stroke={G.goldBright} strokeWidth={2} />
        </svg>
      </MiniPanel>

      <div style={{position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', fontFamily: GF.cn, fontSize: 22, letterSpacing: 6, color: G.ivoryDim, opacity: clamp01((f - fb(69)) / 16)}}>
        效率提升，最后都变成了新的「及格线」
      </div>
      <SourceNote>示意：无纸化办公、4K 视频、AI 方案数量都是方向性示意；不是精确统计。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 5 分钟版：价值迁徙 ---------------- */

const EyeIcon: React.FC<{o: number}> = ({o}) => (
  <svg width={220} height={140} viewBox="0 0 220 140" style={{opacity: o}}>
    <path d="M16 70 Q110 6 204 70 Q110 134 16 70 Z" fill="rgba(214,180,106,0.06)" stroke={G.goldBright} strokeWidth={2} />
    <circle cx={110} cy={70} r={28} fill="none" stroke={G.goldBright} strokeWidth={2} />
    <circle cx={110} cy={70} r={12} fill={G.goldBright} style={{filter: `drop-shadow(0 0 12px ${G.gold})`}} />
    <circle cx={110} cy={70} r={4} fill={G.bg} />
  </svg>
);

export const ValueScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.value[0];
  const p = clamp01((f - at) / 20);
  const arrow = (x1: number, y1: number, x2: number, y2: number, o: number) => (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={G.goldBright} strokeWidth={3} />
      <polygon points={`${x2},${y2} ${x2 - 14},${y2 - 9} ${x2 - 14},${y2 + 9}`} fill={G.goldBright} transform={`rotate(${(Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI} ${x2} ${y2})`} />
    </g>
  );
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="VALUE MIGRATION" sub="价格下跌的地方，价值会迁移到稀缺的地方" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: GF.cn, fontSize: 64, fontWeight: 900, letterSpacing: 18, ...goldText(0.7), opacity: p}}>价值迁徙</div>
      <div style={{position: 'absolute', left: 220, top: 460, width: 650, opacity: clamp01((f - at - 10) / 18)}}>
        <div style={{fontFamily: GF.cn, fontSize: 34, letterSpacing: 6, color: G.ivory}}>带宽 <span style={{color: G.ivoryFaint}}>↓</span></div>
        <svg width={620} height={80} style={{marginTop: 12}}>
          {arrow(20, 40, 560, 40, clamp01((f - at - 20) / 20))}
        </svg>
        <div style={{fontFamily: GF.cn, fontSize: 40, letterSpacing: 6, ...goldText(0.75)}}>注意力 <span style={{color: G.ivoryFaint}}>↑</span></div>
        <div style={{position: 'absolute', right: 20, top: 40}}><EyeIcon o={clamp01((f - at - 30) / 20)} /></div>
      </div>
      <div style={{position: 'absolute', left: 1050, top: 460, width: 680, opacity: clamp01((f - at - 24) / 18)}}>
        <div style={{fontFamily: GF.cn, fontSize: 34, letterSpacing: 6, color: G.ivory}}>AI 方案 <span style={{color: G.ivoryFaint}}>↓</span></div>
        <svg width={620} height={80} style={{marginTop: 12}}>
          {arrow(20, 40, 560, 40, clamp01((f - at - 34) / 20))}
        </svg>
        <div style={{fontFamily: GF.cn, fontSize: 38, letterSpacing: 4, ...goldText(0.75)}}>能源 · 数据 · 判断力 <span style={{color: G.ivoryFaint}}>↑</span></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 840, textAlign: 'center', fontFamily: GF.cn, fontSize: 20, letterSpacing: 4, color: G.ivoryFaint, opacity: clamp01((f - at - 60) / 24)}}>
        便宜的东西负责普及，稀缺的东西负责定价
      </div>
      <SourceNote>示意：价值迁徙是方向性判断，不是投资建议。</SourceNote>
    </AbsoluteFill>
  );
};

/* ---------------- 5 分钟版：时间账单 ---------------- */

export const TimeScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.time[0];
  const bill = f >= fb(97);
  const receipt = clamp01((f - fb(97)) / 24);
  const left = 1 - 0.78 * clamp01((f - at - 20) / 70);
  return (
    <AbsoluteFill>
      <SceneLabel f={f} at={at} text="THE TIME BILL" sub="省下来的时间，最后被谁拿走了" />
      {!bill ? (
        <>
          <div style={{position: 'absolute', left: 260, top: 280, width: 380, height: 420, opacity: clamp01((f - at) / 18)}}>
            <svg width={380} height={380} viewBox="0 0 380 380">
              <circle cx={190} cy={190} r={154} fill="rgba(3,3,3,0.5)" stroke={G.goldLine} strokeWidth={2} />
              {Array.from({length: 12}, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1={190 + Math.cos(a) * 142} y1={190 + Math.sin(a) * 142} x2={190 + Math.cos(a) * 154} y2={190 + Math.sin(a) * 154} stroke={G.gold} strokeWidth={i % 3 === 0 ? 3 : 1} />;
              })}
              <line x1={190} y1={190} x2={190 + Math.cos(-Math.PI / 2 + f * 0.02) * 92} y2={190 + Math.sin(-Math.PI / 2 + f * 0.02) * 92} stroke={G.goldBright} strokeWidth={4} />
              <line x1={190} y1={190} x2={190 + Math.cos(f * 0.006) * 118} y2={190 + Math.sin(f * 0.006) * 118} stroke={G.ivory} strokeWidth={2} />
              <circle cx={190} cy={190} r={9} fill={G.goldBright} style={{filter: `drop-shadow(0 0 12px ${G.gold})`}} />
            </svg>
          </div>
          <div style={{position: 'absolute', left: 760, top: 300, width: 900, opacity: clamp01((f - at) / 18)}}>
            <div style={{fontFamily: GF.cn, fontSize: 24, letterSpacing: 5, color: G.ivoryDim}}>省下来的时间</div>
            <div style={{position: 'relative', width: 760, height: 12, background: 'rgba(239,230,210,0.1)', marginTop: 12}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${left * 100}%`, background: G.goldBright, boxShadow: `0 0 18px ${G.gold}`}} />
            </div>
            {Array.from({length: 10}, (_, i) => {
              const o = clamp01((f - at - 30 - i * 9) / 10);
              return (
                <div key={i} style={{position: 'absolute', left: (i % 2) * 400, top: 70 + Math.floor(i / 2) * 92, width: 350, height: 66, opacity: o, border: `1px solid ${G.goldFaint}`, background: 'rgba(214,180,106,0.04)', padding: '10px 16px', fontFamily: GF.cn, fontSize: 20, color: G.ivory}}>
                  {i % 3 === 0 ? '更高的标准' : i % 3 === 1 ? '更密的排期' : '更快的响应'}
                </div>
              );
            })}
          </div>
          <SourceNote>示意：省下的时间会进入新的任务/标准；不是精确统计。</SourceNote>
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 760, top: 230, width: 700, height: 560, opacity: receipt, transform: `translateY(${(1 - receipt) * 30}px)`, background: 'linear-gradient(160deg, #d9c59a, #b99a63)', border: `1px solid ${G.goldBright}`, boxShadow: '0 30px 90px rgba(0,0,0,0.7)'}}>
            <div style={{position: 'absolute', left: 34, top: 26, fontFamily: GF.latin, fontSize: 16, letterSpacing: 6, color: '#3a2a12'}}>THE TOTAL BILL</div>
            <div style={{position: 'absolute', left: 34, top: 64, fontFamily: GF.cn, fontSize: 44, fontWeight: 900, color: '#1c1206'}}>总账单</div>
            <div style={{position: 'absolute', left: 34, right: 34, top: 130, height: 1, background: 'rgba(30,20,8,0.45)'}} />
            {[
              ['更多灯', '×2.4'],
              ['更宽的路', '×3.1'],
              ['更多的调用', '×10'],
              ['更高的及格线', '×？'],
            ].map(([k, v], i) => (
              <div key={k} style={{position: 'absolute', left: 34, right: 34, top: 160 + i * 76, display: 'flex', justifyContent: 'space-between', fontFamily: GF.cn, fontSize: 26, color: '#2c1d0c'}}>
                <span>{k}</span>
                <span style={{fontFamily: GF.num, fontSize: 34}}>{v}</span>
              </div>
            ))}
            <div style={{position: 'absolute', left: 34, right: 34, bottom: 54, height: 1, background: 'rgba(30,20,8,0.45)'}} />
            <div style={{position: 'absolute', left: 34, right: 34, bottom: 26, display: 'flex', justifyContent: 'space-between', fontFamily: GF.cn, fontSize: 24, color: '#1c1206'}}>
              <span>省下来的</span>
              <span style={{fontFamily: GF.num, fontSize: 38}}>→ 新的标准</span>
            </div>
          </div>
          <div style={{position: 'absolute', left: 220, top: 300, width: 440, opacity: clamp01((f - fb(97) - 10) / 20)}}>
            <div style={{fontFamily: GF.cn, fontSize: 24, letterSpacing: 5, color: G.ivoryDim}}>1865 → 2025</div>
            <div style={{fontFamily: GF.cn, fontSize: 40, lineHeight: 1.6, color: G.ivory, marginTop: 18}}>从煤到 AI，<br />问题没有变：</div>
            <div style={{fontFamily: GF.cn, fontSize: 34, lineHeight: 1.5, color: G.goldBright, marginTop: 10}}>省下来的，去哪了？</div>
          </div>
          <SourceNote>示意：账单数字为方向性示意，不是实际统计。</SourceNote>
        </>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- 5 分钟版：门槛 / 结尾 ---------------- */

export const FinaleScene: React.FC<{f: number}> = ({f}) => {
  const at = SHOTS.finale[0];
  const open = clamp01((f - at) / 30);
  const o = clamp01((f - at) / 18);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: GF.cn, fontSize: 28, letterSpacing: 10, color: G.ivoryDim, opacity: o}}>省，不是变少；省，是把门槛降低</div>
      <svg width={1920} height={1080} style={{position: 'absolute'}} opacity={o}>
        <defs>
          <radialGradient id="jevons-finale-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f3dca0" stopOpacity={0.28} />
            <stop offset="1" stopColor="#d6b46a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={960} cy={650} r={360} fill="url(#jevons-finale-glow)" />
        <rect x={710} y={500} width={50} height={300} fill="rgba(24,18,10,0.96)" stroke={G.goldBright} strokeWidth={2} />
        <rect x={1160} y={500} width={50} height={300} fill="rgba(24,18,10,0.96)" stroke={G.goldBright} strokeWidth={2} />
        <path d="M710 500 Q960 350 1210 500" fill="none" stroke={G.goldBright} strokeWidth={3} />
        <rect x={760 - open * 170} y={530} width={200} height={270} fill="rgba(18,13,8,0.96)" stroke={G.gold} />
        <rect x={960 + open * 170} y={530} width={200} height={270} fill="rgba(18,13,8,0.96)" stroke={G.gold} />
        {Array.from({length: 60}, (_, i) => {
          const t = clamp01((f - at - 10 - rand(i + 600) * 18) / 34);
          if (t <= 0) return null;
          const sx = 860 + rand(i + 610) * 200;
          const tx = 950 + rand(i + 620) * 620;
          return <circle key={i} cx={sx + (tx - sx) * t} cy={800 + rand(i + 630) * 60 - t * 20} r={2 + rand(i + 640) * 4} fill={G.goldBright} opacity={0.3 + 0.5 * rand(i + 650)} />;
        })}
      </svg>
      <SourceNote>示意：门槛降低后，新增用户与新增用量会一起进来；省下来的资源会被系统重新定价。</SourceNote>
    </AbsoluteFill>
  );
};
