import type { Address } from "viem";

/**
 * Address(es) of the world contract, keyed by chain, as well as extra config options.
 */
export type Worlds = Record<string, {
  /** Address of the world contract. */
  address: Address;
  /** World inception block. */
  blockNumber?: number
}>;

export { createHappyConfig, type CreateHappyMUDConfigArgs } from "./happyConfig"
export { createBurnerConfig, type CreateBurnerMUDConfigArgs } from "./burnerConfig"