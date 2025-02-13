import { useComponentValue } from "@latticexyz/react";
import { SyncStep } from "@latticexyz/store-sync";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { useMUD } from "../mud-react";
import { PhaserContainer } from "../phaser-react";
import { LoadingScreen } from "./LoadingScreen";

export const AppContent = () => {
  const { components: { SyncProgress } } = useMUD()

  const syncProgress = useComponentValue(SyncProgress, singletonEntity, {
    message: "Connecting",
    percentage: 0,
    step: SyncStep.INITIALIZE,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n
  });

  return <>
    {syncProgress.step !== SyncStep.LIVE
      ? <LoadingScreen syncProgress={syncProgress} />
      : null
    }
    <PhaserContainer />
  </>;
};