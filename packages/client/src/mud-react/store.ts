import { create } from "zustand";
import { type MUD } from "../mud";

export const useMUDStore = create<MUD | undefined>(() => undefined);