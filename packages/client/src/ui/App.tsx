import { ConnectButton, HappyWalletProvider } from "@happy.tech/react";
import { MUDProvider } from "../mud-react";
import { AppContent } from "./AppContent";

export const App = () => {
  return (
    <HappyWalletProvider>
      <MUDProvider fallback={<div>Loading...</div>}>
        <ConnectButton />
        <AppContent />
      </MUDProvider>
    </HappyWalletProvider>
  );
};
