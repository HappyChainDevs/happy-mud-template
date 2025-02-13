import {
  type Chain,
  createPublicClient,
  createWalletClient,
  fallback,
  http,
  webSocket
} from "viem";
import { happyChainSepolia } from "@happy.tech/core";
import type { MUDClientConfig, WorldConfig } from "../mud";
import { createBurnerAccount, getBurnerPrivateKey, transportObserver } from "@latticexyz/common";
import { MUDChain, mudFoundry, garnet } from "@latticexyz/common/chains";
import type { Worlds } from "./index";
import { parseURLConfig } from "./utils";

/*
 * Example supported chains (local Anvil devnet, HappyChain testnet, Lattice testnet).
 */
const supportedChains: MUDChain[] = [mudFoundry, happyChainSepolia, garnet];

/**
 * Arguments to {@link createBurnerConfig}.
 */
export type CreateBurnerMUDConfigArgs = {
  /** Address(es) of the world contract, keyed by chain. */
  worlds?: Worlds;
  /** World configuration, as defined in `mud.config.ts`. */
  worldConfig?: WorldConfig;
  /** Viem chain object. */
  chain?: Chain;
}

/**
 * Returns a config that can be passed to {@link createMUD} to create a MUD client, and will
 * use use a burner wallet to send transaction.
 */
export async function createBurnerConfig(args: CreateBurnerMUDConfigArgs): Promise<MUDClientConfig> {
  const params = parseURLConfig();

  const chainId = params.chainId || args.chain?.id || import.meta.env.VITE_CHAIN_ID || 31337;
  const worlds = args.worlds ?? (await import("contracts/worlds.json")).default;
  const world = worlds[chainId.toString()];
  const worldAddress = params.worldAddress || world?.address;
  if (!worldAddress) {
    throw new Error(`No world address found for chain ${chainId}. Did you run \`mud deploy\`?`);
  }

  const chain = supportedChains.find((c) => c.id === chainId);
  if (!chain) {
    throw new Error(`Burner Config: chain ${chainId} not found`);
  }

  const publicClient = createPublicClient({
    chain,
    transport: transportObserver(fallback([webSocket(), http()])),
    pollingInterval: 1000
  });

  const burnerAccount = createBurnerAccount(getBurnerPrivateKey());

  const walletClient = createWalletClient({
    chain,
    transport: transportObserver(fallback([webSocket(), http()])),
    account: burnerAccount,
  })
  // TODO move this to mud.ts
  // .extend(transactionQueue())
  // .extend(writeObserver({ onWrite: (write) => write$.next(write) }));

  /*
   * MUD clients use events to synchronize the database, meaning
   * they need to look as far back as when the World was started.
   * The block number for the World start can be specified either
   * on the URL (as initialBlockNumber) or in the worlds.json
   * file. If neither has it, it starts at the first block, zero.
   */
  const initialBlockNumber = params.initialBlockNumber || world?.blockNumber || 0n;

  return {
    publicClient,
    walletClient,
    chain,
    worldAddress,
    initialBlockNumber,
    worldConfig: args.worldConfig
      ?? (await import("contracts/mud.config")).default as unknown as WorldConfig,
  };
}