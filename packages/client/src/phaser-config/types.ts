import { createPhaserEngine } from "@latticexyz/phaserx";
import type { phaserConfig } from "./phaserConfig";

type SceneConfig = typeof phaserConfig.sceneConfig;

/** Phaser scenes, typed according to {@link phaserConfig}. */
export type Scenes = Awaited<ReturnType<typeof createPhaserEngine<SceneConfig>>>["scenes"];

/**
 * Instantiated Phaser engine, as returned from {@link createPhaserEngine}.
 */
export type PhaserEngine = {
  /** Phaser Game object (controller). */
  game: Phaser.Game;
  /** Phaser scenes , typed according to {@link phaserConfig}. */
  scenes: Scenes;
  /** Destroy & cleans up the enginer. */
  dispose: () => void;
}

// Check compatibility
type AssertAssignableTo<_A extends _B, _B> = never
type _Assert = AssertAssignableTo<Awaited<ReturnType<typeof createPhaserEngine<SceneConfig>>>, PhaserEngine>