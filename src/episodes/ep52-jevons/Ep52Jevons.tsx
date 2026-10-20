import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01} from '../../library/anim';
import {Dust, GCaption, GildedBg, Smash} from '../../library/gilded/stage';
import {G} from '../../library/gilded/theme';
import {AdoptScene, AiScene, BookScene, CloudScene, CoalScene, ColdOpen, EndScene, EngineScene, FinaleScene, GateScene, GiantScene, LedScene, LoopScene, Modern2Scene, ModernScene, PriceScene, RoadScene, SplitScene, TimeScene, TitleScene, ValueScene, vis} from './scenes';
import {CUES, cueEnd, cueStart, DARK_FROM, DARK_FROM2, DARK_FROM3, DARK_FROM4, DURATION, fb, FREEZE, HIT, HIT2, HIT3, HIT4, SFX, SHOTS} from './timeline';

/**
 * ep52 杰文斯悖论：越省越多（暗金文献风，无口播，2 分 05 秒）。
 * 结构：四个日常悖论 → 1865 杰文斯 → 瓦特省煤反而煤耗涨十倍 → 省煤 = 降价 → 反弹效应
 * → LED / 高速 / 云 / DeepSeek → 没有巨头靠省总预算成功 → 门槛降低 → 你省下的时间去哪了。
 * 两个重拍：第 4 小节 8.52 秒片头标题，第 40 小节 85.12 秒锚词「越省越多」。
 */
const GRAIN = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAAABAAAAAQBPJcTWAAAFSUlEQVR4nKWX/U9TZxTHzy+LuLhE4jYJmBlBiEwNoqQQCYoEBEKpDdDStEhDCw1QSN9IuS2BXkhfIIXStBZTlJu+QAoFwmsolGDFlA2ioMGp4UUyp8nELHPG6Pbb3USngwmlt3/APfd5vud8v+fzQHWfu1pzHcmfujyUq45fJg+ujAr6H5bw9qY+Hmb0oYUtZNE1LauwB8p0kil1K6OXx4igPdOcdqCe3BnHDRMMJxV8i9bv4WS0UL4SllkvnBoweHF3kbRWfi9zHj3/elKdsj5TjGLSkhWSbeFx14DUcTtqVnOMn1x5T5KZPgYnussly/roPwdJB03VR0eqyFrp5eyL6ctR7GfKp6TypiRWZKNBO0ZN6Qp5KMLKNc055uyqB8V6+iomx+IqGyEjv1eRnqTjT7vaZUyYj0Pjw5+2r2EXrgjimUMxSYbyziO5raFfNr+wJrr645IcXFdaN4eUd0UzQT4zMypPBh7tWKk59T6edyzfHp1xpC/RW2ExhOX0Npcig64UHYlrk/XeSUfNtjDNleZybZl9pYBVndJplUTUR3pMfVwYxwVugZduOR8WImv4hleD3XDMouviRftRY7EBm7o550RLqXx+ynfXDcgFkr5965XBjWslJhlahAJ7JJNBK6wZjQhm551mrsQbPPpHTLFIyrX0HR8891vYpPfS4WnTcE1jZZDSWId6KqP5aAsNQOfMP4iKcbupVBfUj0tDg5+YKBPO4dwztcCvYvahdjhzsycum9VpGS8wYtahzlNNCErBQ3lQu1DnGYGd64fzO+InFcyLId5JXGAxaPLB7OC4+vGfW6/moBNmm4oN28ujjElmZklruPTsqC+ozy8xXpkXhhSD6p4EhrUkQoiJzEsi9toAfDwLokiyEmgJtFfsdRkR2l2x9OoAU7fu7koMXznHetHIdqHX1rLHZcNCWVomu4C/hDSf5J2wsjMo1AN3pprqi+0Tsas0JRuM9EIDbjLitdwahvFN97K/bYUtmvSryfw8xT6NChGhi2NP8AkZhDC+dtQ+avwD44KeEq7gN4ij8uYcFZLGGC+iUUBXSdaDnyzlLeJOYr4MvIB/Xf/MDXdnWkk297oxVj93s0qCBuFvBE0ZRe5XbW1CFQIEImBTNSDU/O+rf7QkFKaH7H8rAHr8SFQgjoT/9lSbahsWUVRqFCEXcJoKxKoQXvJq2tlfhzjrv3gjg5hQeCPO+KqbY0Ij+XWHaG3yVg4OPubEZ00gaIGPKoC/e4DSwC5WVQjTf/+QRBCAjzbiEYh++G+uQsZ8XRHmnLg7T9DX4HeKbkku2H7KXzgTkcMDqXRWmOe+8vmSpYX6svcvmlNYunn2zh6nV3nJTQuO4DKqU3InNK2a5+hWPRfEdbSpcjnSH8pkOeFalpCUXASmhuLYJ3seKvS3nSUzQzUVNsdsBECMWKEt0ph6JUo+oUUdeBuJ6/++EBCL0k8WAUJYcss4bS8zYyqpux1oOL7aIvfqoH5mHxFBIRDAemcs8D8BNqcK+DbszugAnweX3Qc1+GIgX6UggDDauBsQ9FCXLaWjx7V4iw0NhsDWK7STb50Ite0fIx8KnkO0XaMjdPX47CVTnVxJph5QRjEldQrHfREDR4H3Mkbxf66FAFbCxkDALtu9bcbBziidc9lzHnsrZ2wfvUAYjj7cEPz949awAf8PvbkEBOhmFRCnq/cSwTtICGQawffy2hm7IYCltgFUQBhRP4gJAT0W/nmgwO6JUMedOxQrgazu5fqOaN40klXihITX4AtlfekB/ifA5pctEETkj6cEYib+5Ie/AWKt74cpvckGAAAAAElFTkSuQmCC';

const FastGrain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      mixBlendMode: 'screen',
      opacity: 0.1,
      backgroundImage: `url(${GRAIN})`,
      backgroundSize: '160px 160px',
      backgroundRepeat: 'repeat',
    }}
  />
);

const Layer: React.FC<{f: number; a: number; b: number; children: React.ReactNode; fin?: number; fout?: number}> = ({f, a, b, children, fin = 8, fout = 10}) => {
  const o = vis(f, a, b, fin, fout);
  if (o <= 0) return null;
  const p = clamp01((f - a) / Math.max(1, b - a));
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{transform: `scale(${1 + 0.014 * p})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Ep52Jevons: React.FC = () => {
  const f = useCurrentFrame();
  // 重拍前最后 3 帧画面静止：场景和字幕都读这个冻结帧
  const fs = f < HIT && f >= HIT - FREEZE ? HIT - FREEZE : f < HIT2 && f >= HIT2 - FREEZE ? HIT2 - FREEZE : f < HIT3 && f >= HIT3 - FREEZE ? HIT3 - FREEZE : f < HIT4 && f >= HIT4 - FREEZE ? HIT4 - FREEZE : f;

  const dark1 = f >= HIT ? 0 : Math.pow(clamp01((f - DARK_FROM) / (HIT - FREEZE - DARK_FROM)), 0.7) * 0.94;
  const dark2 = f >= HIT2 || f < DARK_FROM2 ? 0 : Math.pow(clamp01((f - DARK_FROM2) / (HIT2 - FREEZE - DARK_FROM2)), 0.7) * 0.94;
  const dark3 = f >= HIT3 || f < DARK_FROM3 ? 0 : Math.pow(clamp01((f - DARK_FROM3) / (HIT3 - FREEZE - DARK_FROM3)), 0.7) * 0.94;
  const dark4 = f >= HIT4 || f < DARK_FROM4 ? 0 : Math.pow(clamp01((f - DARK_FROM4) / (HIT4 - FREEZE - DARK_FROM4)), 0.7) * 0.94;
  const dark = Math.max(dark1, dark2, dark3, dark4);

  // 现代案例段落稍微转冷，和 1865 的暖金拉开一点距离
  const cool = vis(f, fb(32), HIT2 + 6, 30, 30);

  return (
    <AbsoluteFill style={{background: G.bg}}>
      <Audio src={staticFile('audio/ep52-jevons/bgm.wav')} />
      {SFX.map(([file, at, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={90}>
          <Audio src={staticFile(file)} volume={vol} />
        </Sequence>
      ))}

      <GildedBg f={f} glow={[50, 42]} strength={1.28} />
      {cool > 0 ? (
        <AbsoluteFill style={{opacity: cool * 0.6}}>
          <GildedBg f={f} tone="cool" glow={[50, 42]} strength={0.9} />
        </AbsoluteFill>
      ) : null}
      <Dust f={f} n={58} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 55% 50% at 50% 46%, rgba(214,180,106,0.05), rgba(0,0,0,0) 70%)', pointerEvents: 'none'}} />

      {/* 冷开场 */}
      {f < HIT ? <ColdOpen f={fs} /> : null}

      {/* 片头砸字：硬切，不淡入 */}
      {f >= HIT && f < SHOTS.title[1] + 8 ? <TitleScene f={f} /> : null}

      <Layer f={f} a={SHOTS.book[0]} b={SHOTS.book[1]}><BookScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.engine[0]} b={SHOTS.engine[1]}><EngineScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.coal[0]} b={SHOTS.coal[1]}><CoalScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.split[0]} b={SHOTS.split[1]}><SplitScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.adopt[0]} b={SHOTS.adopt[1]}><AdoptScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.loop[0]} b={SHOTS.loop[1]}><LoopScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.modern[0]} b={SHOTS.modern[1]}><ModernScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.led[0]} b={SHOTS.led[1]}><LedScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.road[0]} b={SHOTS.road[1]}><RoadScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.cloud[0]} b={SHOTS.hit2[0]}><CloudScene f={fs} /></Layer>

      {/* 第二个爆点：锚词砸出 */}
      {f >= HIT2 && f < SHOTS.hit2[1] + 10 ? (
        <AbsoluteFill style={{opacity: 1 - clamp01((f - (SHOTS.hit2[1] - 6)) / 16)}}>
          <Smash f={f} at={HIT2} text="越省越多" size={190} sub="杰文斯悖论 · Jevons Paradox" ring={1250} flash={1} y={450} />
        </AbsoluteFill>
      ) : null}

      <Layer f={f} a={SHOTS.price[0]} b={SHOTS.price[1]}><PriceScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.ai[0]} b={SHOTS.ai[1]}><AiScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.giant[0]} b={SHOTS.giant[1]}><GiantScene f={fs} /></Layer>
      <Layer f={f} a={SHOTS.gate[0]} b={SHOTS.gate[1]}><GateScene f={fs} /></Layer>

      <Layer f={f} a={SHOTS.paperless[0]} b={SHOTS.paperless[1]}><Modern2Scene f={fs} focus="paper" at={SHOTS.paperless[0]} /></Layer>
      <Layer f={f} a={SHOTS.bandwidth[0]} b={SHOTS.bandwidth[1]}><Modern2Scene f={fs} focus="band" at={SHOTS.bandwidth[0]} /></Layer>
      <Layer f={f} a={SHOTS.office[0]} b={SHOTS.office[1]}><Modern2Scene f={fs} focus="office" at={SHOTS.office[0]} /></Layer>
      <Layer f={f} a={SHOTS.montage2[0]} b={SHOTS.montage2[1]}><Modern2Scene f={fs} focus="all" at={SHOTS.montage2[0]} /></Layer>

      <Layer f={f} a={SHOTS.valueBand[0]} b={SHOTS.valueBand[1]}><ValueScene f={fs} focus="band" at={SHOTS.valueBand[0]} /></Layer>
      <Layer f={f} a={SHOTS.valueAI[0]} b={SHOTS.valueAI[1]}><ValueScene f={fs} focus="ai" at={SHOTS.valueAI[0]} /></Layer>

      <Layer f={f} a={SHOTS.timeClock[0]} b={SHOTS.timeClock[1]}><TimeScene f={fs} phase="clock" at={SHOTS.timeClock[0]} /></Layer>
      <Layer f={f} a={SHOTS.timeTasks[0]} b={SHOTS.timeTasks[1]}><TimeScene f={fs} phase="tasks" at={SHOTS.timeTasks[0]} /></Layer>
      <Layer f={f} a={SHOTS.timeBill[0]} b={SHOTS.timeBill[1]}><TimeScene f={fs} phase="bill" at={SHOTS.timeBill[0]} /></Layer>
      <Layer f={f} a={SHOTS.timeClose[0]} b={SHOTS.preHit3[1]}><TimeScene f={fs} phase="close" at={SHOTS.timeBill[0]} /></Layer>

      {f >= HIT3 && f < HIT4 ? (
        <AbsoluteFill style={{opacity: 1 - clamp01((f - (HIT4 - 20)) / 20)}}>
          <Smash f={f} at={HIT3} text="总账单" size={180} sub="THE BILL · 越省越多" ring={1300} flash={1} y={450} />
        </AbsoluteFill>
      ) : null}

      {f >= HIT4 && f < HIT4 + 38 ? (
        <AbsoluteFill style={{opacity: 1 - clamp01((f - (HIT4 + 18)) / 18)}}>
          <Smash f={f} at={HIT4} text="门槛" size={180} sub="省，不是变少" ring={1250} flash={1} y={450} />
        </AbsoluteFill>
      ) : null}

      <Layer f={f} a={SHOTS.finaleGate[0]} b={SHOTS.finaleGate[1]}><FinaleScene f={fs} phase="gate" at={SHOTS.finaleGate[0]} /></Layer>
      <Layer f={f} a={SHOTS.finaleClock[0]} b={SHOTS.finaleClock[1]}><FinaleScene f={fs} phase="clock" at={SHOTS.finaleClock[0]} /></Layer>
      <Layer f={f} a={SHOTS.endTitle[0]} b={SHOTS.endTitle[1]} fin={12} fout={4}><EndScene f={fs} phase="title" at={SHOTS.endTitle[0]} /></Layer>
      <Layer f={f} a={SHOTS.endQuestion[0]} b={DURATION} fin={8} fout={1}><EndScene f={fs} phase="question" at={SHOTS.endQuestion[0]} /></Layer>

      <AbsoluteFill style={{background: '#000', opacity: dark, pointerEvents: 'none'}} />

      {CUES.map(([bar, zh, en], i) => {
        const at = cueStart(i);
        if (f < at - 2) return null;
        const halfOut: Record<number, number> = {3: DARK_FROM, 38: DARK_FROM2, 110: DARK_FROM3, 117: DARK_FROM4};
        const out = bar === 125 ? SHOTS.endTitle[0] - 4 : halfOut[bar] ?? cueEnd(i) - 12;
        if (f > out + 14) return null;
        const text = bar === 53 ? '不是故障，是默认设置。' : zh;
        const english = bar === 53 ? 'It’s the default.' : en;
        return <GCaption key={i} f={fs} at={at} out={out} text={text} en={english} y={940} size={46} perChar={1} />;
      })}

      <AbsoluteFill style={{background: '#000', opacity: clamp01((f - (DURATION - 18)) / 18), pointerEvents: 'none'}} />
      <FastGrain />
    </AbsoluteFill>
  );
};
