import {G} from '../gilded/theme';

/**
 * 3D 舞台的配色：直接把暗金文献风的 G 映射到三维材质和灯光。
 * 底色、雾、金、暖光、朱红都沿用 2D 的色值，保证 3D 画布和 DOM 字幕叠在一起不跳色。
 */
export const T = {
  bg: G.bg,
  fog: '#050403',
  gold: G.gold,
  goldBright: G.goldBright,
  goldDeep: G.goldDeep,
  ivory: G.ivory,
  ember: '#ff9a3c',
  emberDeep: '#c8513c',
  red: G.red,
  metal: '#17120b',
  paper: '#e6d5ae',
};

/** 相机默认值：35mm 左右的轻微长焦，低机位，浅景深 */
export const CAM = {
  fov: 36,
  near: 0.1,
  far: 80,
};

export const deg = (d: number) => (d * Math.PI) / 180;
