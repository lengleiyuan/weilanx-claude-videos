#!/usr/bin/env bash
# 参考视频的第一遍机器拆解：时长/画幅、音轨、每 5 秒帧、联系表、切点、响度、卡点。
# 用法：bash .claude/skills/weilanx-creator-reference-replica/scripts/analyze-reference.sh <video> [outdir]
set -euo pipefail

VIDEO=${1:?用法: analyze-reference.sh <video> [outdir]}
OUT=${2:-analysis}
ROOT=$(cd "$(dirname "$0")/../../../.." && pwd)
mkdir -p "$OUT/frames" "$OUT/audio" "$OUT/subs"

echo "== probe =="
ffprobe -v error \
  -show_entries format=duration,size,bit_rate \
  -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels \
  -of json "$VIDEO" > "$OUT/probe.json"
cat "$OUT/probe.json"

echo "== audio =="
ffmpeg -v error -y -i "$VIDEO" -vn -ac 1 -ar 16000 "$OUT/audio/mono.wav"

echo "== frames / contact sheets =="
ffmpeg -v error -y -i "$VIDEO" -vf "fps=1/5,scale=480:-1" "$OUT/frames/f_%03d.jpg"
ffmpeg -v error -y -start_number 1 -i "$OUT/frames/f_%03d.jpg" \
  -vf "scale=480:-1,tile=4x4" -frames:v 60 "$OUT/sheet_%02d.jpg"

echo "== subtitle crops（每 1 秒底部一条，便于 OCR/人眼读） =="
ffmpeg -v error -y -i "$VIDEO" -vf "fps=1,crop=iw*0.75:ih*0.13:iw*0.125:ih*0.80,scale=1440:-1,format=gray" \
  "$OUT/subs/s_%03d.png"

echo "== scene cuts =="
ffmpeg -hide_banner -i "$VIDEO" -vf "select='gt(scene,0.3)',showinfo" -f null - 2> "$OUT/scenes.log" || true
grep -o 'pts_time:[0-9.]*' "$OUT/scenes.log" | head -80 > "$OUT/scene-cuts.txt" || true
echo "cut count: $(wc -l < "$OUT/scene-cuts.txt" | tr -d ' ')"
head -20 "$OUT/scene-cuts.txt" || true

echo "== loudness / peak =="
ffmpeg -hide_banner -i "$VIDEO" -af "ebur128=peak=true" -f null - 2> "$OUT/loudness.log" || true
grep -E "I:|LRA:|Peak:" "$OUT/loudness.log" | tail -4 || true

echo "== beat grid =="
BEATS="$ROOT/.claude/skills/weilanx-creator-gilded-video/scripts/beats.py"
if [ -f "$BEATS" ]; then
  PYTHON=${PYTHON:-python3}
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO" | cut -d. -f1)
  if command -v uv >/dev/null 2>&1; then
    uv run --with numpy python "$BEATS" "$OUT/audio/mono.wav" --to "${DUR:-380}" --top 12 | tee "$OUT/beats.txt" || true
  elif "$PYTHON" -c "import numpy" >/dev/null 2>&1; then
    "$PYTHON" "$BEATS" "$OUT/audio/mono.wav" --to "${DUR:-380}" --top 12 | tee "$OUT/beats.txt" || true
  else
    echo "skip beats: numpy / uv 不可用"
  fi
else
  echo "skip beats: 没找到 $BEATS"
fi

echo "== done =="
echo "看 $OUT/probe.json、$OUT/sheet_*.jpg、$OUT/scene-cuts.txt、$OUT/beats.txt、$OUT/loudness.log"
echo "下一步：通看联系表，按 SKILL.md 第 2 节做人眼拆解。"
