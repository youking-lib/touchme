"use client";

import { useMemo } from "react";

import { ModelMutation } from "../model";
import { ExtraModifier } from "./utils-types";
import { useSelector } from "./useSelector";

type UseMutationReturn = ExtraModifier<typeof ModelMutation>;

export function useMutation(): UseMutationReturn {
  const dispatch = useSelector((_, dispatch) => dispatch);

  return useMemo(() => {
    const modifier = {} as UseMutationReturn;

    (Object.keys(ModelMutation) as (keyof UseMutationReturn)[]).forEach(key => {
      // @ts-ignore
      modifier[key] = (...args: any[]) => {
        dispatch(draft => {
          // @ts-ignore
          return ModelMutation[key](draft, ...args);
        });
      };
    });

    return modifier;
  }, [dispatch]);
}
