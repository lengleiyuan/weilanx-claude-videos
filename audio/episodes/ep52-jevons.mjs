// ep52 杰文斯悖论：2 分 05 秒纯音乐短片。
// 配乐从参考样片提取的 0–125 秒（public/music/jevons-ref.mp3），112.8 BPM，
// 第 4 小节 8.52 秒片头砸字，第 40 小节 85.12 秒锚词大重拍；0–125 秒正好到第 58.75 小节。
// 另生成三个本期专用音效：impact（重拍低频冲击）、chime（数字亮点）、riser（第二高潮前 2 秒的呼吸）。
import {execFileSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {cutMusic} from '../music.mjs';

const EP = 'ep52-jevons';
const DURATION = 300;

if (cutMusic({track: 'jevons-ref', start: 0, duration: DURATION, ep: EP, fadeIn: 0.02, fadeOut: 3})) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio', EP);
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);

  // 低频冲击：55→30 Hz 下滑正弦 + 褐噪声，指数衰减 1.4 秒，峰值压到约 −9 dBFS
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='0.42*exp(-3.4*t)*sin(2*PI*(55*t-8*t*t))|0.42*exp(-3.4*t)*sin(2*PI*(55*t-8*t*t))':s=48000:d=1.4",
    '-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.4:d=1.4:r=48000',
    '-filter_complex', '[1]lowpass=f=160,afade=t=out:st=0:d=0.8,volume=0.5,pan=stereo|c0=c0|c1=c0[n];[0][n]amix=inputs=2:normalize=0,alimiter=limit=0.5,volume=0.42[o]',
    '-map', '[o]', join(dir, 'impact.wav'),
  ]);

  // 数字亮点：1046.5 + 1568 Hz 两个正弦，快起慢落，像一枚很轻的铃
  ff([
    '-f', 'lavfi', '-i', "aevalsrc='0.16*exp(-5*t)*(sin(2*PI*1046.5*t)+0.55*sin(2*PI*1568*t)+0.3*sin(2*PI*2093*t))':s=48000:d=0.9",
    '-af', 'afade=t=in:d=0.008,afade=t=out:st=0.15:d=0.75,volume=0.8', '-ac', '2', join(dir, 'chime.wav'),
  ]);

  // 呼吸：带通噪声从 300 Hz 扫到 2.4 kHz，2 秒渐强，接在第二高潮前
  ff([
    '-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=0.35:d=2.2:r=48000',
    '-af', 'highpass=f=200,lowpass=f=3200,afade=t=in:d=1.9,afade=t=out:st=2.0:d=0.2,volume=0.22', '-ac', '2', join(dir, 'riser.wav'),
  ]);

  // 底噪：很轻的室内空气声，整片循环
  ff(['-f', 'lavfi', '-i', `anoisesrc=color=pink:amplitude=0.035:d=${DURATION}:r=48000`, '-af', `lowpass=f=800,highpass=f=60,afade=t=in:d=1,afade=t=out:st=${DURATION - 2}:d=2,pan=stereo|c0=c0|c1=c0`, join(dir, 'room.wav')]);

  console.log(`wrote ${EP}/impact.wav, chime.wav, riser.wav, room.wav`);
}
