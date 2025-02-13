import { useEffect, useState, useRef } from "react";

/** Status of the result of {@link usePromise}, see there for details. */
export type UsePromiseStatus = "idle" | "pending" | "fulfilled" | "rejected";

/**
 * The result of {@link usePromise}, compatible with {@link PromiseSettledResult}, but adding the
 * "idle" and "rejected" statuses, as well as returning the promise itself (to handle the case
 * where it is returned by a function).
 *
 * Defining the type like this, enables optional chaining on {@code value} and {@code reason} — but only if
 * the promise can't resolve or reject with a falsy value.
 */
export type UsePromiseResult<T> = {
  status: UsePromiseStatus
  value?: T | undefined
  reason?: unknown | undefined
  promise?: Promise<T> | undefined
}

export type MaybePromiseOrFn<T> =
  | Promise<T>
  | (() => Promise<T> | undefined)
  | undefined

/**
 * Given a promise or a function returning a promise, returns an object describing the status and
 * result of the promise's execution.
 *
 * - If the object passed is falsy, the status will be "idle".
 * - Otherwise, the status wil be "pending" until the promise resolves or rejects.
 * - The status will be "fulfilled" or "rejected" when the promise resolves, with the {@code value}
 *   or {@value reason} fields set, respectively.
 *
 * If you pass in a function, make sure it is stable (e.g. use `useCallback`).
 */
export function usePromise<T>(promiseOrFn: MaybePromiseOrFn<T>): UsePromiseResult<T> {
  // Cache for the parameter (to check for changes).
  const promiseOrFnRef = useRef<MaybePromiseOrFn<T>>();

  // Cache for the promise (avoid re-running function on each rerender)
  const promiseRef = useRef<Promise<T> | undefined>();

  // The result of the promise.
  const [_result, setResult] = useState<UsePromiseResult<T>>({ status: "idle" });
  let result = _result

  // On param change (including initial call), reset promise.
  if (promiseOrFnRef.current !== promiseOrFn) {
    promiseOrFnRef.current = promiseOrFn;
    promiseRef.current = undefined;
  }

  // Get promise (call function if needed) and set initial result.
  if (!promiseRef.current) {
    promiseRef.current = typeof promiseOrFn === 'function'
      ? promiseOrFn()
      : promiseOrFn;
    if (promiseRef.current) {
      result = { status: "pending", promise: promiseRef.current };
      // will be "idle" otherwise
    }
  }

  // Wait for the promise and set the result accordingly.
  useEffect(() => {
    if (!promiseOrFn) return; // no promise, nothing to do

    let isMounted = true;

    function setResultSafe(result: UsePromiseResult<T>) {
      // Setting react state causes error if component is unmounted.
      if (!isMounted) return;

      // The parameter changed, discard the result.
      if (promiseOrFnRef.current !== promiseOrFn) return;

      setResult({ ...result, promise: promiseRef.current });
    }

    promiseRef.current!
      .then((result) => setResultSafe({ status: "fulfilled", value: result }))
      .catch((err) => setResultSafe({ status: "rejected", reason: err }));

    return () => {
      isMounted = false;
    };
  }, [promiseOrFn]);

  return result;
}