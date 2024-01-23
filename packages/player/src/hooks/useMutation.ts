"use client";

import { useMemo } from "react";

import { StateMutation } from "../model";
import { ExtraModifier } from "./utils-types";
import { useSelector } from "./useSelector";

type UseMutationReturn = ExtraModifier<typeof StateMutation>;

export function useMutation(): UseMutationReturn {
  const dispatch = useSelector((_, dispatch) => dispatch);

  return useMemo(() => {
    const modifier = {} as UseMutationReturn;

    (Object.keys(StateMutation) as (keyof UseMutationReturn)[]).forEach(key => {
      modifier[key] = (...args: any[]) => {
        dispatch(draft => {
          // @ts-ignore
          StateMutation[key](draft, ...args);
        });
      };
    });

    return modifier;
  }, []);
}
