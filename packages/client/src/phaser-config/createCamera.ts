import type { PhaserEngine } from "./index";

export const createCamera = (phaser: PhaserEngine) => {
  const {
    scenes: {
      Main: {
        camera: { phaserCamera },
      },
    },
  } = phaser;

  phaserCamera.setBounds(-1000, -1000, 2000, 2000);
  phaserCamera.centerOn(0, 0);
};
