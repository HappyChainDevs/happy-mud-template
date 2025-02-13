import { create } from "zustand";
import type { PhaserEngine } from "../phaser-config";

export const usePhaserStore = create<PhaserEngine | undefined>(() => undefined);