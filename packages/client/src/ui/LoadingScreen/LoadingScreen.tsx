import type { Component, ComponentValue } from "@latticexyz/recs";
import React from "react";
import styled from "styled-components";
import type { MUD } from "../../mud";
import { LoadingBar } from "./LoadingBar";
import { BootScreen } from "./BootScreen";

type SyncProgressT = MUD["components"]["SyncProgress"] extends Component<infer T> ? T : never;
type SyncProgress = ComponentValue<SyncProgressT>

export type LoadingScreenProps = {
  syncProgress: SyncProgress;
}

export const LoadingScreen = ({ syncProgress }: LoadingScreenProps) => {
  return <div style={{ pointerEvents: "none" }}>
    <BootScreen>
      {syncProgress.message}…
      <LoadingContainer>
        {Math.floor(syncProgress.percentage)}%
        <Loading percentage={syncProgress.percentage} />
      </LoadingContainer>
    </BootScreen>
  </div>;
};

const LoadingContainer = styled.div`
    display: grid;
    justify-items: start;
    justify-content: start;
    align-items: center;
    height: 30px;
    width: 100%;
    grid-gap: 20px;
    grid-template-columns: auto 1fr;
`;

const Loading = styled(LoadingBar)`
    width: 100%;
    min-width: 200px;
`;
