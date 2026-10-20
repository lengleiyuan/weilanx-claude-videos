import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {Ep52CoverTall} from './episodes/ep52-jevons/Cover';
import {Ep52Jevons} from './episodes/ep52-jevons/Ep52Jevons';
import {DURATION, FPS, H, W} from './episodes/ep52-jevons/timeline';

/**
 * 只装 ep52 的轻量入口：正式工程用 src/index.ts；
 * 这个入口用于导出，避免加载其它期数里会联网拉 Google Fonts 的模块。
 */
const Ep52Root: React.FC = () => (
  <>
    <Composition id="ep52-jevons" component={Ep52Jevons} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Still id="ep52-jevons-cover-tall" component={Ep52CoverTall} width={1080} height={1440} />
  </>
);

registerRoot(Ep52Root);
