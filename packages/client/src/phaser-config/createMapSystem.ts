import { Tileset } from "../artTypes/world";
import { createNoise2D } from "simplex-noise";
import type { PhaserEngine } from "./index";

export function createMapSystem(phaser: PhaserEngine) {
  const {
    scenes: {
      Main: {
        maps: {
          Main: { putTileAt },
        },
      },
    },
  } = phaser;

  const noise = createNoise2D();

  for (let x = -500; x < 500; x++) {
    for (let y = -500; y < 500; y++) {
      const coord = { x, y };
      const seed = noise(x, y);

      putTileAt(coord, Tileset.Grass, "Background");

      if (seed >= 0.45) {
        putTileAt(coord, Tileset.Mountain, "Foreground");
      } else if (seed < -0.45) {
        putTileAt(coord, Tileset.Forest, "Foreground");
      }
    }
  }
}
