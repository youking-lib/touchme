import { useCallback, useContext, useLayoutEffect, useState } from "react";
import { PlayerContext } from "./context";

export function useLazyPlayer() {
  const player = useContext(PlayerContext);
  const [lazyer] = useState(() => {
    let resolve: (
      value: PlayerContext | PromiseLike<PlayerContext>
    ) => void = () => {};

    const promise = new Promise<PlayerContext>(r => {
      resolve = r;
    });

    const lazyer = {
      promise,
      resolve,
    };

    return lazyer;
  });

  useLayoutEffect(() => {
    if (player) {
      lazyer.resolve(player);
    }
  }, [player]);

  return useCallback(
    (callback?: (palyer: PlayerContext) => void) => {
      if (callback) {
        lazyer.promise.then(callback);
      }

      return lazyer.promise;
    },
    [lazyer]
  );
}
