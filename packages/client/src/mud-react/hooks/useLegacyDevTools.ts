import mudConfig from "contracts/mud.config";
import { useEffect } from "react";
import type { MUD } from "../../mud";

/**
 * Displays the legacy dev tools inline in the page if enabled.
 *
 * This only displays when running in dev mode (ENV is set — Vite does this automatically),
 * it also needs VITE_DEV_TOOLS to be set to any value.
 *
 * The explorer running on http://localhost:13690/ is an upgrade to the dev tool — use that instead!
 */
export function useLegacyDevTools(mud: MUD | undefined) {
  useEffect(() => {
    if (!import.meta.env.DEV || !import.meta.env.VITE_DEV_TOOLS) return;
    if (!mud) return;

    import("@latticexyz/dev-tools").then(({ mount: mountDevTools }) =>
      mountDevTools({
        config: mudConfig,
        // TODO fix types, but this helps while we put the type fires out
        publicClient: mud.network.publicClient as never,
        walletClient: mud.network.walletClient as never,
        latestBlock$: mud.network.latestBlock$,
        storedBlockLogs$: mud.network.storedBlockLogs$,
        worldAddress: mud.network.worldContract.address,
        worldAbi: mud.network.worldContract.abi,
        write$: mud.network.write$,
        recsWorld: mud.world,
      }),
    );
  }, [mud]);
}