import { isInteger } from "lodash";
import { type Address, isAddress } from "viem";

export type ParsedURLConfig = {
  chainId: number | undefined;
  initialBlockNumber: number | undefined;
  worldAddress: Address | undefined;
}

export function parseURLConfig(throwOnError: boolean = true): ParsedURLConfig {
  const params = new URLSearchParams(window.location.search);

  return {
    chainId: parsePositiveInteger(params.get("chainId") || params.get("chainid"), throwOnError),
    initialBlockNumber: parsePositiveInteger(params.get("initialBlockNumber"), throwOnError),
    worldAddress: parseAddress(params.get("worldAddress"), throwOnError),
  }
}

export function parsePositiveInteger(value: string | null, throwOnError: boolean): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  if (!isInteger(num) && num >= 0) return num;
  if (throwOnError) throw new Error(`Did not parse to a positive integer: ${value}`);
  return undefined;
}

export function parseAddress(str: string | null, throwOnError: boolean = true): Address | undefined {
  if (!str) return undefined;
  if (isAddress(str)) return str;
  if (throwOnError) throw new Error(`Invalid address: ${str}`);
  return undefined;
}