import {describe, expect, it} from 'vitest';
import {
  ANCHOR,
  COAL_MULT,
  CUES,
  DURATION,
  FACTS,
  FINAL_QUESTION,
  FPS,
  HALF_BARS,
  HIT,
  HIT2,
  HIT3,
  HIT4,
  NVDA_DROP_PCT,
  NVDA_LOSS_B,
  PRICE_RATIO,
  SHOTS,
  WATT_COAL_SAVING_PCT,
  cueEnd,
  cueStart,
  fb,
  fr,
} from '../../src/episodes/ep52-jevons/timeline';

/** 中文长度：去掉【】标记、空格和标点，只数汉字与数字/字母 */
const zhLen = (s: string) => s.replace(/[【】\s]/g, '').replace(/[，。；：、？！——·,.!?;:]/g, '').length;

describe('ep52 杰文斯悖论', () => {
  it('片长和两个重拍落在实测拍点上', () => {
    expect(FPS).toBe(30);
    expect(DURATION).toBe(fr(300));
    // 8.52 秒 / 85.12 秒，允许 2 帧误差
    expect(Math.abs(HIT - 256)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT2 - 2554)).toBeLessThanOrEqual(2);
    expect(HIT).toBe(fb(4));
    expect(HIT2).toBe(fb(40));
    expect(Math.abs(HIT3 - 7081)).toBeLessThanOrEqual(2);
    expect(Math.abs(HIT4 - 7531)).toBeLessThanOrEqual(2);
  });

  it('字幕按小节递增、在片长内、中文不超过 18 字、英文不为空', () => {
    let last = -1;
    for (const [bar, zh, en] of CUES) {
      const at = fb(bar);
      expect(at).toBeGreaterThan(last);
      expect(at).toBeLessThan(DURATION);
      expect(zhLen(zh)).toBeLessThanOrEqual(18);
      expect(en.trim().length).toBeGreaterThan(0);
      last = at;
    }
    expect(cueStart(0)).toBe(0);
    expect(cueEnd(CUES.length - 1)).toBe(DURATION);
  });

  it('锚词出现、结尾抛问题、重拍前一句说一半', () => {
    const text = CUES.map(([, zh]) => zh).join('');
    expect(text).toContain(ANCHOR);
    expect(CUES[CUES.length - 1][1].includes('时间')).toBe(true);
    expect(FINAL_QUESTION.endsWith('？')).toBe(true);
    for (const bar of HALF_BARS) {
      const i = CUES.findIndex(([b]) => b === bar);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(CUES[i][1].length).toBeGreaterThan(0);
    }
  });

  it('镜头段落首尾相接，覆盖全片', () => {
    const shots = Object.values(SHOTS);
    expect(shots[0][0]).toBe(0);
    expect(shots[shots.length - 1][1]).toBe(DURATION);
    for (let i = 1; i < shots.length; i++) {
      expect(shots[i][0]).toBe(shots[i - 1][1]);
    }
  });

  it('片中的数字和说法互相一致', () => {
    expect(COAL_MULT).toBe(10);
    expect(WATT_COAL_SAVING_PCT).toBe(66);
    expect(PRICE_RATIO).toBe(27);
    expect(NVDA_DROP_PCT).toBe(17);
    expect(NVDA_LOSS_B).toBe(600);
    expect(FACTS.coalMult).toBe(10);
    expect(FACTS.fuelPricePct).toBe(30);
    expect(FACTS.priceRatio).toBe(PRICE_RATIO);
  });
});
