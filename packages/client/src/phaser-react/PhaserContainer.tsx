import { createPhaserEngine } from "@latticexyz/phaserx";
import Phaser from "phaser";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { createCamera, createMapSystem, phaserConfig } from "../phaser-config";
import { usePromise } from "../utils/usePromise";
import { usePhaserStore } from "./store";
import { useSize } from "./useSize";

/**
 * Returns an outer div. Whenever MUD has loaded, initializes Phaser and mounts a fullscreen inner
 * div inside the outer div to render Phaser.
 */
export const PhaserContainer = () => {
  const outerDiv = useRef<HTMLElement | null>(null);

  // On mount, create the inner div and attach it to the outer div.
  const innerDiv = useMemo(() => {
    const inner = document.createElement("div");
    inner.style.width = "100vw";
    inner.style.height = "100vh";
    inner.style.pointerEvents = "all";
    inner.style.overflow = "hidden";
    if (outerDiv.current) {
      outerDiv.current.appendChild(inner);
    }
    return inner;
  }, []);

  // Called with the outer div, attaching the inner div to it if it already exists.
  const outerDivRefCallback = useCallback(
    (el: HTMLElement | null) => {
      outerDiv.current = el;
      if (innerDiv) {
        if (outerDiv.current) {
          outerDiv.current.appendChild(innerDiv);
        } else {
          innerDiv.remove();
        }
      }
    },
    [innerDiv],
  );

  const { width, height } = useSize(innerDiv);

  const phaserPromise = useMemo(async () => {
    const phaser = await createPhaserEngine({
      ...phaserConfig,
      scale: {
        ...phaserConfig.scale,
        parent: innerDiv,
        mode: Phaser.Scale.NONE,
        width,
        height,
      },
    });

    createCamera(phaser);
    createMapSystem(phaser);
    return phaser;

    // We don't want width/height to recreate phaser layer, so we ignore linter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unload Phaser and remove the innner div when this component unmounts.
  useEffect(() => {
    return () => {
      phaserPromise?.then((phaser) => phaser?.dispose());
      innerDiv?.remove();
    };
  }, [innerDiv, phaserPromise]);

  const { value: phaserLayer } = usePromise(phaserPromise);

  // Initialize storage when the promise resolves, clear it when this component unmounts.
  useEffect(() => {
    if (phaserLayer) {
      usePhaserStore.setState(phaserLayer);
    }
    return () => {
      usePhaserStore.setState(undefined);
    }
  }, [phaserLayer]);

  return <div ref={outerDivRefCallback} />;
};
