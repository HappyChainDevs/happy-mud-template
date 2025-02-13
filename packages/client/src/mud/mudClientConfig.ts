import { type Address, type Chain, type PublicClient, type WalletClient } from "viem";
import { defineWorld } from "@latticexyz/world";

/**
 * World configuration, as defined in `mud.config.ts`.
 */
export type WorldConfig = ReturnType<typeof defineWorld>;

/**
 * MUD client configuration, to be passed into {@link createMUD}.
 *
 * This defines where to find the World contract for this app, and how to interact with it.
 */
export type MUDClientConfig = {
  /** Public client to be used by MUD. */
  publicClient: PublicClient;
  /** Wallet client to be used by MUD. */
  walletClient: WalletClient;
  /** Chain where the world contract is deploy. */
  chain: Chain;
  /** Address of the world contract. */
  worldAddress: Address;
  /** Initial block from which to synchronize the world contract. */
  initialBlockNumber: number | bigint;
  /** Imported from contracts/mud.config.ts (table configuration & more). */
  worldConfig: WorldConfig
}