import { ContractWrite } from "@latticexyz/common";
import { transactionQueue, writeObserver } from "@latticexyz/common/actions";
import { createWorld } from "@latticexyz/recs";
import { syncToRecs } from "@latticexyz/store-sync/recs";
import { share, Subject } from "rxjs";
import { getContract } from "viem";
import type { MUDClientConfig } from "./mudClientConfig";
import type { MUD, WalletClientWithAccount, WorldContract } from "./types";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";

/**
 * Creates the MUD client that can then be accessed in react via
 * @param mudConfig
 */
export async function createMUD(mudConfig: MUDClientConfig): Promise<MUD> {
  const worldContract = getContract({
    address: mudConfig.worldAddress,
    abi: IWorldAbi,
    client: { public: mudConfig.publicClient, wallet: mudConfig.walletClient },
  }) as unknown as WorldContract; // viem ¯\_(ツ)_/¯

  const world = createWorld();


   // Sync on-chain state into RECS and keeps our client in sync. Uses the MUD indexer if available,
   // otherwise falls back to the viem publicClient to make RPC calls to fetch MUD events from the
   // chain.
  const { components, latestBlock$, storedBlockLogs$, waitForTransaction } = await syncToRecs({
    world,
    config: mudConfig.worldConfig,
    address: mudConfig.worldAddress,
    publicClient: mudConfig.publicClient,
    startBlock: BigInt(mudConfig.initialBlockNumber)
  });

  // TODO customize add components & system calls
  // const components = createClientComponents(network);
  // const systemCalls = createSystemCalls(network, components);
  const systemCalls = {};

   // Create an observable for contract writes that we can pass into MUD dev tools for transaction
   // observability.
  const write$ = new Subject<ContractWrite>();

  const walletClient = (mudConfig.walletClient as WalletClientWithAccount)
    .extend(transactionQueue())
    .extend(writeObserver({ onWrite: (write) => write$.next(write) }));

  return {
    world,
    systemCalls,
    components,
    network: {
      publicClient: mudConfig.publicClient,
      walletClient,
      latestBlock$,
      storedBlockLogs$,
      waitForTransaction,
      worldContract,
      write$: write$.asObservable().pipe(share())
    }
  };
}