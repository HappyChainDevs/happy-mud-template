import { type ComponentType, type ReactNode, Suspense, useEffect } from "react";
import { useLegacyDevTools } from "./hooks/useLegacyDevTools";
import { usePromise } from "../utils/usePromise";
import { type MUDClientConfig, createMUD, type MUD } from "../mud";
import { createHappyConfig } from "../mud-configs";
import { useMUDStore } from "./store";

export type MudProviderProps = {
  /** {@link MUDClientConfig} to use, {@link createHappyConfig} will be used by default. */
  mudClientConfig?: MUDClientConfig | Promise<MUDClientConfig>;
  /** Fallback component to use for loading. */
  fallback: ReactNode;
  /** Fallback component to use for rendering errors — the error will be thrown if not provided. */
  errorFallback?: ComponentType<{ error: unknown }>;
  children: ReactNode;
}

/**
 * Not actually a real provider (doesn't have an associated React context), but makes sure the MUD
 * client ({@link MUD}) is initialized before rendering the children, rendering the fallback
 * meanwhile.
 *
 * There is also an optional error fallback, which gets rendered, with an `error` prop in case
 * MUD initialization fails with an error.
 */
export const MUDProvider = ({
  mudClientConfig,
  fallback,
  errorFallback: ErrorFallback,
  children,
}: MudProviderProps) => {
  const { value: mud, reason, promise } = usePromise<MUD>(
    async () => createMUD(await (mudClientConfig ?? createHappyConfig())));

  useEffect(() => {
    promise!.then((mud) => {
      useMUDStore.setState(mud);
    });
    return () => {
      promise!.then((mud) => {
        useMUDStore.setState(undefined);
        mud.world.dispose()
      });
    };
  }, [promise]);

  useLegacyDevTools(mud);

  if (reason) {
    if (!ErrorFallback) throw reason;
    return <ErrorFallback error={reason} />;
  }

  return <Suspense fallback={fallback}>
    {children}
  </Suspense>;
};