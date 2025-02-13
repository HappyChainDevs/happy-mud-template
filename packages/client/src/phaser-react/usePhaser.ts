import type { PhaserEngine } from "../phaser-config";
import { usePhaserStore } from "./store";

export function usePhaser(): PhaserEngine {
  const store = usePhaserStore();
  if (!store) throw new Error("Phaser store not initialized");
  return store;
}