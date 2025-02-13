import { ContractWrite } from "@latticexyz/common";
import { Component, type Entity, EntitySymbol, Metadata, Schema } from "@latticexyz/recs";
import { StorageAdapterBlock, WaitForTransactionResult } from "@latticexyz/store-sync";
import type { SyncToRecsResult } from "@latticexyz/store-sync/recs";
import mudConfig from "contracts/mud.config";
import { Observable } from "rxjs";
import type { Chain, GetContractReturnType, Transport, WalletClient } from "viem";
import { type Account, type Block, Hex, type PublicClient } from "viem";
import { createSystemCalls } from "./createSystemCalls";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export type MUD = {
  world: World
  systemCalls: SystemCalls
  components: ClientComponents
  network: MUDNetwork
}

export type World = {
  registerEntity: ({ id, idSuffix }?: {
    id?: string | undefined;
    idSuffix?: string | undefined;
  }) => Entity;
  components: Component<Schema, Metadata, unknown>[];
  registerComponent: (component: Component) => void;
  dispose: (namespace?: string) => void;
  registerDisposer: (disposer: () => void, namespace?: string) => void;
  hasEntity: (entity: Entity) => boolean;
  getEntities: () => IterableIterator<Entity>;
  entitySymbols: Set<EntitySymbol>;
  deleteEntity: (entity: Entity) => void;
}

export type Components = Awaited<SyncToRecsResult<typeof mudConfig, NoExtraTables>>["components"];

type NoExtraTables = Record<string, never>;

export type ClientComponents = Components & {
  // add your client components types here
}

export type MUDNetwork = {
  publicClient: PublicClient;
  walletClient: WalletClient
  latestBlock$: Observable<Block>;
  storedBlockLogs$: Observable<StorageAdapterBlock>;
  waitForTransaction: (tx: Hex) => Promise<WaitForTransactionResult>;
  worldContract: WorldContract;
  write$: Observable<ContractWrite>;
  playerEntity?: Entity;
}

export type WorldContract = GetContractReturnType<typeof IWorldAbi, WalletClientWithAccount>;

/**
 * Type of a wallet client that has its account set.
 */
export type WalletClientWithAccount = WalletClient<Transport, Chain, Account>;