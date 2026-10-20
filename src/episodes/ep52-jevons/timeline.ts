/**
 * ep52 杰文斯悖论：越省越多（暗金文献风，无口播，2 分 05 秒，配乐从参考样片提取的 0–125 秒）。
 *
 * 音乐实测：0.01 秒起音，112.8 BPM，一小节 2.1278 秒。
 * 第 4 小节 8.52 秒是片头重拍（标题砸出）；第 40 小节 85.12 秒是回落段之后整段重新进来的大重拍（锚词「越省越多」）。
 * 68–85 秒是配乐回落段，正好留给「现代案例」；85 秒之后进入第二幕。
 *
 * 叙事：四个日常悖论 → 1865 杰文斯《煤炭问题》→ 瓦特省煤 2/3，英国煤耗反而涨十倍
 * → 省煤 = 燃料降价 → 需求扩张 → 反弹效应 → LED / 高速 / 云计算 / DeepSeek
 * → 没有巨头靠替客户省总预算成功，都是把单价打穿 → 价值迁徙 → 省下的时间被系统收回 → 抛问题。
 *
 * 锚词「越省越多」：开头作为问题出现，85.12 秒大重拍砸出，结尾重新定义「省不是变少，是把门槛降低」。
 */
export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** 用两个实测重拍反推网格：第 4 小节 8.52 秒、第 40 小节 85.12 秒，相隔 36 小节 */
export const BAR = (85.12 - 8.52) / 36;
export const BAR0 = 8.52 - 4 * BAR;
export const BEAT = BAR / 4;
export const barSec = (k: number) => BAR0 + BAR * k;
export const fr = (sec: number) => Math.round(sec * FPS);
export const fb = (k: number) => fr(barSec(k));
export const fbt = (b: number) => fb(b / 4);

/** 片头标题重拍（第 4 小节）和锚词大重拍（第 40 小节） */
export const HIT = fb(4);
export const HIT2 = fb(40);
/** 重拍前约 0.75 秒收暗，最后 3 帧静止 */
export const DARK_FROM = fr(barSec(4) - 0.78);
export const DARK_FROM2 = fr(barSec(40) - 0.78);
export const FREEZE = 3;

/** 125 秒 = 第 58.75 小节；最后 1 秒淡黑 */
export const DURATION = fr(125);

export const ANCHOR = '越省越多';
export const TERM = '杰文斯悖论 · Jevons Paradox';
export const TERM2 = '反弹效应 · Rebound Effect';

/**
 * 字幕：[小节号, 中文, 英文]。【】里的词变金色；中文不超过 18 字；每句停到下一句开始。
 * 第一幕从片头重拍后开始，第二幕从 85.12 秒大重拍后开始。
 */
export const CUES: [number, string, string][] = [
  // 冷开场：四个日常悖论，一拍一个
  [0, '路修宽了，车却堵得更死。', 'Widen the road — traffic gets worse.'],
  [1, '灯更【省电】了，电费却没少。', 'More efficient lights, same bill.'],
  [2, '无纸化二十年，用纸翻了三倍。', 'Twenty years paperless — three times the paper.'],
  [3, 'AI 省下半天，我们下班更晚。', 'AI saves half a day; we leave later.'],
  // 1865：杰文斯与瓦特
  [5, '1865 年，一个英国人盯上了煤。', 'In 1865, a Briton fixed his eyes on coal.'],
  [7, '他叫杰文斯，写下《煤炭问题》。', 'William Stanley Jevons wrote The Coal Question.'],
  [9, '瓦特的新蒸汽机，省煤三分之二。', 'Watt’s engine burned a third of the coal.'],
  [11, '全英国都以为，煤矿得救了。', 'Britain believed its coal was saved.'],
  [13, '到 1900 年，英国煤耗涨了十倍。', 'By 1900, Britain burned ten times the coal.'],
  [15, '省煤的机器，为什么吃掉更多煤？', 'Why did a coal-saving machine eat more coal?'],
  // 机制：省煤 = 降价
  [17, '工程师看见效率，生意人看见【降价】。', 'Engineers saw efficiency. Merchants saw a price cut.'],
  [19, '省煤，等于把燃料成本打了三折。', 'Saving coal cut fuel costs to thirty percent.'],
  [21, '以前只够抽水，现在全厂都用得起。', 'Once only pumps; now every mill could afford it.'],
  [23, '动力一便宜，机器就多了起来。', 'Cheaper power bred more machines.'],
  [25, '机器越多，要烧的煤反而越多。', 'More machines burned more coal, not less.'],
  [27, '省下的，被更大的需求吃掉了。', 'The savings were eaten by bigger demand.'],
  [29, '这叫【反弹效应】，不是煤炭的怪事。', 'This is the rebound effect — not just coal.'],
  [31, '每一次效率提升，都在重演它。', 'Every efficiency gain repeats it.'],
  // 现代案例：LED / 高速 / 云
  [32, 'LED 省电九成，我们却装了更多灯。', 'LEDs save 90%, so we install more lights.'],
  [34, '四车道拓成八车道，高峰更堵。', 'Four lanes to eight — worse rush hour.'],
  [36, '云更便宜，企业存下每一次点击。', 'Cheaper cloud stores every click.'],
  [38, '单价跌了，总账单翻了几倍。', 'Unit prices fell; the bill multiplied.'],
  // 第二幕：AI 与商业
  [41, '2025 年，模型价格跌到几十分之一。', '2025: model prices fall to a fraction.'],
  [43, '华尔街先慌：算力是不是见顶了？', 'Wall Street panics: is compute peaking?'],
  [45, '可 AI 一便宜，接进了每张表格。', 'But cheaper AI entered every spreadsheet.'],
  [47, '调用量爆炸，算力和电费一起爆炸。', 'Calls explode; so do compute and power bills.'],
  [49, '没有巨头靠替客户省总预算成功。', 'No giant won by shrinking the total bill.'],
  [51, '它们只做一件事：把单价打穿。', 'They all did one thing: break the unit price.'],
  [52, '让奢侈品，变成日用品。', 'Turn luxury into a daily necessity.'],
  [53, '【越省越多】，不是故障，是默认设置。', 'More from less isn’t a glitch. It’s the default.'],
  [55, '省，不是变少；省，是把门槛降低。', 'Saving isn’t less. It lowers the gate.'],
  [56, '你省下来的时间，去了哪里？', 'Where did your saved time go?'],
];
export const cueStart = (i: number) => fb(CUES[i][0]);
export const cueEnd = (i: number) => (i + 1 < CUES.length ? cueStart(i + 1) : DURATION);
/** 片头重拍前那句和锚词前那句：随收暗一起退场，把画面留给大字 */
export const HALF_BARS = [3, 38];

/** 镜头段落，首尾相接；每个段落自己按小节算元素出场 */
export const SHOTS = {
  open: [0, HIT], // 四张证据卡，一拍一张，最后收成一个光点
  title: [HIT, fb(5)], // 片头砸字：杰文斯悖论
  book: [fb(5), fb(9)], // 1865：杰文斯与《煤炭问题》
  engine: [fb(9), fb(13)], // 瓦特蒸汽机：省煤 2/3，全英国欢呼
  coal: [fb(13), fb(17)], // 1900：煤耗涨十倍
  split: [fb(17), fb(21)], // 工程师 vs 生意人：省煤 = 降价
  adopt: [fb(21), fb(25)], // 以前只够抽水，现在全厂都用得起
  loop: [fb(25), fb(29)], // 反弹效应：效率↑ → 单价↓ → 用量↑ → 总耗↑
  modern: [fb(29), fb(32)], // 三个现代案例的引子
  led: [fb(32), fb(34)], // LED：省电九成，灯更多
  road: [fb(34), fb(36)], // 高速：四车道变八车道
  cloud: [fb(36), HIT2], // 云：单价跌，总账单涨
  hit2: [HIT2, fb(41)], // 锚词「越省越多」砸出
  price: [fb(41), fb(45)], // DeepSeek 价格与英伟达下跌
  ai: [fb(45), fb(49)], // AI 接进每张表格：调用量爆炸
  giant: [fb(49), fb(53)], // 没有巨头靠省总预算成功：打穿单价
  gate: [fb(53), fb(57)], // 门槛降低：越省越多；重新定义锚词
  end: [fb(57), DURATION], // 结尾问题
} as const;

/* ---------------- 片中的事实与数字（测试核对） ---------------- */

/** 1865 年杰文斯出版《The Coal Question》 */
export const BOOK_YEAR = 1865;
/** 瓦特蒸汽机把每马力小时的煤耗降到老机器的约 1/3（省煤约 2/3） */
export const WATT_COAL_RATIO = 1 / 3;
export const WATT_COAL_SAVING_PCT = 66;
/** 到 1900 年，英国煤耗相对瓦特时代涨了约十倍（保守口径；19 世纪实际涨幅更高） */
export const COAL_MULT = 10;
/** 省煤把燃料成本压到约 30% */
export const FUEL_PRICE_RATIO = 0.3;
/** 机器人数量：100 倍（示意，表达「机器总数涨了一百倍」） */
export const MACHINE_MULT = 100;
/** 2025 年 1 月：OpenAI o1 与 DeepSeek R1 的每百万输出 token 价格（美元） */
export const O1_PRICE = 60;
export const R1_PRICE = 2.19;
export const PRICE_RATIO = Math.round(O1_PRICE / R1_PRICE);
/** 2025-01-27 英伟达单日跌幅与市值蒸发（约） */
export const NVDA_DROP_PCT = 17;
export const NVDA_LOSS_B = 600;
/** 反弹效应：效率提升 1%，需求可能扩张更多 */
export const REBOUND_NOTE = '示意：效率提升会降低单位成本，新增需求可能吃掉甚至超过节省量';

/** 字幕里出现的关键数字，测试里核对 */
export const FACTS = {
  bookYear: BOOK_YEAR,
  coalMult: COAL_MULT,
  fuelPricePct: Math.round(FUEL_PRICE_RATIO * 100),
  machineMult: MACHINE_MULT,
  priceRatio: PRICE_RATIO,
  nvdaDropPct: NVDA_DROP_PCT,
  nvdaLossB: NVDA_LOSS_B,
};

/* ---------------- 音效：[文件, 帧, 音量] ---------------- */
const A = 'audio/ep52-jevons';
const s = (name: string, at: number, v: number): [string, number, number] => [`${A}/${name}.wav`, at, v];

export const SFX: [string, number, number][] = [
  s('impact', HIT, 0.5),
  s('impact', HIT2, 0.55),
  s('riser', fr(barSec(40) - 2.0), 0.28),
  s('chime', fb(13), 0.3),
  s('chime', fb(41), 0.28),
  s('chime', fb(47), 0.26),
  s('impact', fb(51), 0.28),
  s('chime', fb(53), 0.32),
];
