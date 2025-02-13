import {
  type Chain,
  createPublicClient,
  createWalletClient,
  custom,
} from "viem";
import { happyProvider, defaultChain } from "@happy.tech/core";
import type { MUDClientConfig, WorldConfig } from "../mud";
import type { Worlds } from "./index";
import { parseURLConfig } from "./utils";

/**
 * Arguments to {@link createHappyConfig}.
 */
export type CreateHappyMUDConfigArgs = {
  /** Address(es) of the world contract, keyed by chain. */
  worlds?: Worlds;
  /** World configuration, as defined in `mud.config.ts`. */
  worldConfig?: WorldConfig;
  /** Viem chain object. */
  chain?: Chain;
}

/**
 * Returns a config that can be passed to {@link createMUD} to create a MUD client, and will
 * use the Happy Wallet to send transactions.
 */
export async function createHappyConfig(args?: CreateHappyMUDConfigArgs): Promise<MUDClientConfig> {
  args ??= {}
  const params = parseURLConfig();

  if (params.chainId) {
    console.warn("Ignored URL chainId parameter with HappyChain MUD config.");
  }

  const chain = args.chain || defaultChain;
  const chainId = chain.id;
  const worlds = args.worlds ?? (await import("contracts/worlds.json")).default;
  const world = worlds[chain.id.toString()];
  const worldAddress = params.worldAddress || world?.address;
  if (!worldAddress) {
    throw new Error(`No world address found for chain ${chainId}. Did you run \`mud deploy\`?`);
  }

  /*
   * MUD clients use events to synchronize the database, meaning
   * they need to look as far back as when the World was started.
   * The block number for the World start can be specified either
   * on the URL (as initialBlockNumber) or in the worlds.json
   * file. If neither has it, it starts at the first block, zero.
   */
  const initialBlockNumber = params.initialBlockNumber || world?.blockNumber || 0n;

  return {
    publicClient: createPublicClient({ transport: custom(happyProvider) }),
    walletClient: createWalletClient({ transport: custom(happyProvider) }),
    chain,
    worldAddress,
    initialBlockNumber,
    worldConfig: args.worldConfig
      ?? (await import("contracts/mud.config")).default as unknown as WorldConfig,
  };
}