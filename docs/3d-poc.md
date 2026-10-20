# 3D 舞台 PoC（Three.js / React Three Fiber）

这个分支在原来的 Remotion 工程上加了一层 **可复用的 3D 舞台**。目标不是把整期视频重做成 3D，而是先把“3D 能力”做成一个可验证的模块：一个 `ThreeCanvas` 舞台、一套暖金灯光、一组低多边形道具，以及一个 8.5 秒的蒸汽机 PoC 镜头。

## 加了什么

| 文件 / 作品 | 作用 |
|---|---|
| `src/library/three/ThreeStage.tsx` | ThreeCanvas 舞台：相机、雾、暖金三点光、ACES 色彩管理 |
| `src/library/three/props.tsx` | 程序化道具：蒸汽机、飞轮、煤块、蒸汽、浮尘、加法光晕 |
| `src/library/three/theme.ts` | 3D 配色 / 相机常量，和暗金文献风的 `G` 对齐 |
| `src/library/three/ThreeDemo.tsx` | 10 秒 `library-three` 演示 |
| `src/episodes/ep52-jevons/Engine3DClip.tsx` | 8.5 秒 `ep52-engine-3d`：3D 蒸汽机 + 原来的 DOM 字幕/年份/仪表 |
| `src/three-entry.tsx` | 只装 3D 实验 composition 的轻量入口，渲染时不会去拉 Google Fonts |

Studio 里会在 **10-3D实验室** 文件夹下看到：

- `library-three`
- `ep52-engine-3d`

## 怎么跑

```sh
npm install

# Studio：主工程（含 3D 实验室文件夹）
npm run studio

# 只开 3D 入口，加载更快
npx remotion studio src/three-entry.tsx

# 渲染 8.5 秒 PoC
npx remotion render src/three-entry.tsx ep52-engine-3d \
  out/ep52-engine-3d.mp4 \
  --scale=1 --concurrency=1 --codec=h264 --crf=20 --pixel-format=yuv420p
```

`remotion.config.ts` 已加：

```ts
Config.setChromiumOpenGlRenderer('angle');
```

没有 ANGLE 时，headless Chrome 的 WebGL 可能退回软件渲染，速度会掉一个数量级。

## 实测速度（这台 Mac）

- 255 帧、1920×1080、30fps、单并发：**约 22 秒**（约 11.6 fps）。
- 推算：2 分 05 秒全 3D ≈ 5–10 分钟；6 分钟 ≈ 15–30 分钟。
- 如果加真实 Bloom / DOF / 软阴影，会慢 2–5 倍；不要把“全片 3D + 重后处理”当成默认方案。

## 三条硬规则

1. **不要用 `useFrame`。** `ThreeCanvas` 在渲染时会把 `frameloop` 强制成 `never`，所有动画必须从 `useCurrentFrame()` 算出来，写进位置、旋转、材质参数。
2. **不要用 `Math.random()`。** 用 `rand(seed)`，否则抽帧/重渲会对不上。
3. **中文不要做 3D TextGeometry。** 中文字体转 JSON 体积大、三角面多；继续用 DOM 的 `GCaption`、`YearHeader`、`Smash` 叠在 Canvas 上面。原片里的大字大概率也是后期叠的。

## 为什么没有 Bloom / EffectComposer

试过 `@react-three/postprocessing` 的 `EffectComposer`：在 `ThreeCanvas` 的 `frameloop='never'` 下，画面会整个变黑。  
当前方案改用：

- 材质 `emissive` + 高金属度；
- 局部加法混合的 `sprite` 光晕（`GlowSprite`）；
- 3D 雾 + DOM 的径向渐变/暗角。

这对暗金风已经够用。如果以后一定要 Bloom/DOF，有两条路：

1. 写一个自定义 composer，在每次 R3F 渲染后手动 `composer.render()`（要处理帧同步，风险高）；
2. 把 3D 镜头预渲染成带 alpha 的序列，再回 Remotion 合成（质量最高，但改一帧要重渲）。

## 怎么接到正片里

主片 `Ep52Jevons.tsx` 仍然用 2D 版。要接 3D，只需要把对应 `Layer` 里的场景换掉：

```tsx
// 现在
<Layer f={f} a={SHOTS.engine[0]} b={SHOTS.engine[1]}><EngineScene f={fs} /></Layer>

// 3D
<Layer f={f} a={SHOTS.engine[0]} b={SHOTS.engine[1]}><Engine3DScene f={fs} /></Layer>
```

字幕、音效、`timeline.ts`、重拍收暗、`Smash` 都不用动。建议顺序：

1. 蒸汽机（已有 PoC）
2. 八车道
3. 云服务器
4. 天平 / 大门

书、煤耗曲线、工程师 vs 生意人、AI 网格、结尾继续用 2D——这些是信息图，3D 化会降低可读性。

## 已知边界

- 这是**代码化低多边形**，不是 Blender 级资产；材质、软阴影、体积光只能做到“神似”。
- 蒸汽机是示意结构，不是工程复原。
- 3D 画布和 DOM 叠层要做色彩校准；当前用 ACES + sRGB + DOM 暖色渐变对齐。
- WebGL 长渲染有 context loss 风险；目前 255 帧没问题，长片建议分段渲染。
- 没有外部模型 / 贴图，全部程序化生成；后续如果接 GLB，要记录授权和体积。
