import { type MUD } from "../../mud"
import { useMUDStore } from "../store";

export function useMUD(): MUD {
  const mud = useMUDStore();
  // Throwing a promise triggers suspense. In React 19 we can use `use` instead.
  if (!mud) throw Promise.resolve("MUD is loading");
  return mud;
}