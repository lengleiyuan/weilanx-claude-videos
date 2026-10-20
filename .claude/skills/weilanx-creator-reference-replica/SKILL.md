---
name: weilanx-creator-reference-replica
description: 「给一条参考视频 → 直接跑完整套 2D 复刻成片」工作流。用户说「我给你一个视频，按这个流程跑」「照着这条做一期」「复刻这个视频」「参考这条视频做」时使用。默认 2 分 05 秒、16:9、1920×1080、30fps、中英双语、无口播、暗金文献风、纯 2D（禁止 Three.js）。一口气做完：拆片 → 风格/选题 → 重写文案 → 测拍排时间表 → 画面 → 配乐音效 → 自检 → 导出 → 3:4 封面 → 抖音标题/描述 → 交付报告。
---

# 一条参考视频 → 一期 2D 成片

这个 Skill 把「看片 → 拆片 → 写自己的文案 → 卡拍子 → 做画面 → 自检 → 交付」固定成一条流水线。  
**目标不是把原片搬过来，是学它的选题、结构、画面语法和节奏，用我们自己的话和画面重做一条。**

参考实现：`src/episodes/ep52-jevons/`（2 分 05 秒、暗金文献风、双语字幕、两个重拍），成片在 `out/05-暗金文献风/00-越省越多/`。

## 0. 先记住三条

1. **默认纯 2D。** 原片是 3D 也只做 2D 风格化复刻；不要安装/使用 `three`、`@react-three/fiber`、`@remotion/three`。
2. **内容不搬。** 原片的句子、标题、水印、创作者名字、任何一帧都不进我们的素材；只学结构和语法。
3. **先测音乐，再写画面。** 时间表从配乐的小节/重拍里长出来，不靠感觉。

## 1. 输入与默认值

用户给一个视频文件路径（或链接下载后的本地文件）。没有特别说明时，用下表默认值，不再逐项确认：

| 项 | 默认 |
|---|---|
| 时长 | 2 分 05 秒；原片 < 3 分钟时可跟原片同长（±5 秒）；原片 > 4 分钟默认 2:05，不擅自做 6 分钟 |
| 画幅 | 横屏 16:9，1920×1080，30fps |
| 字幕 | 中文主字幕（≤18 字）+ 英文斜体副行 |
| 口播 | 无；字幕就是旁白 |
| 风格 | 优先匹配仓库现有风格（暗金文献风 / 黑金光影风 / 战术屏 / 灯火史话）；都不匹配再做 2D 蒸馏 |
| 选题 | 同题重写；用户给了新题就用新题 |
| 配乐 | 优先用户提供的有授权曲目；没有就提取参考音轨做本地 demo，并在报告里标红授权 |
| 封面 | 3:4，1080×1440 |
| 交付 | 一锅出，中途不问；最后一起交付 |

**只在这三种情况停下来问：**

- 视频没给，或者文件打不开；
- 某个关键数字/引文查不到任何一手资料；
- 配乐要公开发布但用户没有授权，且不接受“先做本地 demo”。

## 2. 第 1 步：机器拆一遍

先建分析目录，跑下面这些命令（把 `<VIDEO>` 换成实际路径）：

```sh
mkdir -p analysis/frames analysis/audio
ffprobe -v error -show_entries format=duration,size,bit_rate \
  -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels \
  -of json "<VIDEO>" > analysis/probe.json

ffmpeg -v error -i "<VIDEO>" -vn -ac 1 -ar 16000 analysis/audio/mono.wav
ffmpeg -v error -i "<VIDEO>" -vf "fps=1/5,scale=480:-1" analysis/frames/f_%03d.jpg
ffmpeg -v error -i "<VIDEO>" -vf "fps=1/5,scale=480:-1,tile=4x4" -frames:v 40 analysis/sheet_%02d.jpg
```

能装 `tesseract` 就顺手 OCR 底部字幕；装不了就用关键帧人工读，不要编字幕。  
再跑：

- **镜头表**：`ffmpeg -i "<VIDEO>" -vf "select='gt(scene,0.3)',showinfo" -f null -`，把切点秒数记下来。
- **配乐**：优先用仓库的卡点脚本：
  ```sh
  uv run --with numpy python .claude/skills/weilanx-creator-gilded-video/scripts/beats.py analysis/audio/mono.wav --to <原片时长> --top 12
  ```
  拿到起音、BPM、小节长、重拍候选；用两个最可信的重拍反推 `BAR/BAR0`。
  没有 `uv` 就用环境里带 numpy 的 Python：`PYTHON=/path/to/python bash .claude/skills/weilanx-creator-reference-replica/scripts/analyze-reference.sh <video>`；卡点这一步不能省。
- **响度/人声**：`ffmpeg -i "<VIDEO>" -af ebur128=peak=true -f null -`；看频谱/字幕判断是不是纯音乐。有人声就不要抽原音轨当 BGM，改用用户曲或程序化配乐。
- **构图**：每 5 秒一张联系表，先通看一遍，把镜头分成：标题卡 / 实物 / 图表 / 大字 / 人物 / 转场。

产出：`materials/<风格>/<NN>-<短题>/拆解报告.md`，至少写：

- 时长、画幅、镜头数、平均镜头长度、硬切频率；
- 主色板、强调色、字体层级、字幕位置；
- 3～5 个「招牌画面」和它们的入场/转场方式；
- 配乐 BPM、小节长、两个最重的重拍、卡点习惯；
- **哪些不搬**（原片文案、标题、水印、具体构图）。

## 3. 第 2 步：人眼再拆一遍

机器只告诉你“哪里变了”，不告诉你“为什么好看”。逐张看关键帧和局部放大：

- 标题卡的字号、字距、描边/发光；
- 实物镜头的材质、光从哪来、阴影多硬；
- 图表是“画出来”的还是“弹出来”的；
- 入场几帧完成、先快后慢还是匀速、有没有模糊/缩放；
- 转场是硬切、叠化、还是同一个元素贯穿。

写进拆解报告的「画面语法」一节。**风格一比一，内容不搬。**

## 4. 第 3 步：重写文案（先找锚词）

参考 `ep52-jevons/timeline.ts` 的 `CUES`。

- **锚词**：2～4 个字，是知识落在普通人生活里的处境，不是术语。例：杰文斯悖论 →「越省越多」；生日悖论 →「巧合」；热恋 →「过期」。
- **冷开场**：4 个日常悖论，一拍一个（约 8.5 秒），最后一个收成一个光点。
- **第一幕**：历史/原理，讲清楚“为什么”。
- **第一个重拍**：片头标题或锚词砸出。
- **第二幕**：现代案例/生活落点。
- **第二个重拍**：锚词第二次砸出，配乐换气后整段重新进来的位置。
- **结尾**：重新定义锚词 + 一个人人都有答案的问题（以「？」结尾）。
- 中文每句 ≤18 字；英文是意译，不是逐字翻译。
- 数字、年份、人名先查一手资料，写进 `timeline.ts` 常量，测试里断言；示意图标「示意」。

## 5. 第 4 步：写 `timeline.ts`（全片唯一时间表）

照 `src/episodes/ep52-jevons/timeline.ts`：

```ts
export const BAR = (HIT2_SEC - HIT_SEC) / (HIT2_BAR - HIT_BAR);
export const BAR0 = HIT_SEC - HIT_BAR * BAR;
export const barSec = (k: number) => BAR0 + BAR * k;
export const fb = (k: number) => Math.round(barSec(k) * 30);

export const HIT = fb(4);    // 片头重拍
export const HIT2 = fb(40);  // 锚词大重拍
export const DARK_FROM = fb(barSec(4) - 0.78);
export const DARK_FROM2 = fb(barSec(40) - 0.78);
export const FREEZE = 3;
export const DURATION = 125 * 30;
```

必须包含：

- `CUES: [bar, 中文, 英文][]`，每句都卡小节线；
- `SHOTS`，首尾相接，覆盖全片；
- `SFX`，重拍冲击、关键数字、转场；
- `ANCHOR / TERM`；
- 事实常量 + `FACTS`。

测试至少覆盖：重拍帧、字幕递增/长度/英文、锚词出现、结尾问号、镜头段落连续、数字常量。

## 6. 第 5 步：做画面（2D）

- 先读 `src/library/README.md`，优先复用 `gilded/` 的 `GildedBg`、`Dust`、`Grain`、`YearHeader`、`BookCite`、`GCaption`、`Smash`。
- 一期一个目录：`src/episodes/epNN-主题/`；`timeline.ts` + `EpNN.tsx` + `scenes.tsx` + `Cover.tsx`。
- 动画 = 帧号的纯函数；禁止 `Math.random()`、CSS 动画、真实时间；随机用 `rand(seed)`。
- 画面里只留一条“贯穿母题”（煤块、金心、日历环、齿轮……），让镜头之间能接上。
- 每个场景先抽一帧看：字有没有重叠/出画、元素有没有出现、该亮的是不是亮了。
- 不做 3D；不做 3D 文字；中文继续用 DOM。

## 7. 第 6 步：配乐与音效

- 用户有授权曲：放进 `public/music/`，在 `audio/music.mjs` 的 `TRACKS` 和 `public/music/README.md` 补一行；用 `beats.py` 重测网格。
- 没有：从参考音轨截 0–125 秒（仅在参考无人声时），`cutMusic` 到 −16 LUFS；报告里写清“仅本地 demo，公开发布前确认授权/替换”。
- 音效：重拍 impact、数字 chime、转场 riser/room；音量别抢配乐。
- AI 听不到声音：只报响度和峰值，最后请用户戴耳机确认。

## 8. 第 7 步：自检（最多 3 轮）

```sh
npm run typecheck
npm test -- tests/episodes/epNN-主题.test.ts
npx remotion still src/index.ts epNN-主题 out/f.jpg --frame=N --scale=0.5
npx remotion still src/index.ts epNN-主题-cover-tall out/cover.png
```

必看：

- 0 秒、HIT、HIT2、每个镜头段落中点、结尾；
- 两个高潮前后 6 帧：收暗 → 静止 3 帧 → 爆发；
- 字幕最长的一句有没有贴边/出画；
- 整片响度 −16 LUFS 左右、峰值 ≤ −1.5 dBFS；
- 没有原片帧、水印、创作者名字。

改满 3 轮就停，把剩余小问题写进报告，不无限打磨。

## 9. 第 8 步：交付

建目录：

```sh
bash scripts/ep-dir.sh epNN-主题 materials --new 05-暗金文献风 中文短题
bash scripts/ep-dir.sh epNN-主题 out
```

交付物全部放进同一个 `out/<风格>/<NN>-<短题>/`：

| 文件 | 内容 |
|---|---|
| `epNN-主题.mp4` | 成片，1920×1080 / 30fps |
| `epNN-主题-cover-tall.png` | 3:4 封面，1080×1440 |
| `字幕稿-中英.srt` / `字幕稿-中文.srt` | 字幕稿 |
| `发布文案.md` | 抖音标题、正文、话题、置顶评论 |
| `交付报告.md` | 来源、时间表、响度、决定、已知问题、授权 |

报告固定写：用了哪些一手资料、哪些数字是算的、替用户做了哪些决定、还剩什么小瑕疵、BGM 授权状态。  
最后把期数补进 `styles/README.md` 和对应风格 README 的期数表。

## 10. 禁止清单

- 不做 3D；不装 `three` / `@react-three/*`。
- 不照搬原片句子、标题、水印、创作者信息、任何一帧。
- 不克隆原片人声；参考有人声就只学结构，配音要用户自己录。
- 不用 `Math.random()`、CSS 动画、`useFrame`。
- 不把 2 分钟默认拖成 6 分钟。
- 不交“只有画面没有声音”的成片；没有授权曲也要有临时音轨并标红。
- 不在事实查不到时编数字。

## 11. 下次怎么用

把视频放进工作区，直接说：

> 按 `weilanx-creator-reference-replica` 跑这条视频。2:05，16:9，中英双语，配乐用我给的 XXX。

没有特别说明就按本文默认值跑；中途只在第 1 节列出的三种情况下停。最后一起交 mp4、封面、字幕、文案、报告。
