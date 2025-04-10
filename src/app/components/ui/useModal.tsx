"use client";

import { PropsWithChildren, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

const useModal = () => {
  const [showing, setShowing] = useState(false);
  const open = useCallback(() => setShowing(true), []);
  const hide = useCallback(() => setShowing(false), []);

  const Modal = useCallback(
    ({
      children,
      shadowClassName,
      className,
      containerClassName,
    }: {
      className?: string;
      shadowClassName?: string;
      containerClassName?: string;
    } & PropsWithChildren) => {
      return !showing ? null : (
        <div
          className={twMerge(
            "fixed top-0 left-0 w-full h-screen flex justify-center items-center",
            !showing && "hidden",
            containerClassName
          )}
        >
          <div
            className={twMerge(
              "bg-white rounded-2xl mt-5 transition-all ",

              className
            )}
          >
            {children}
          </div>
          <span
            onClick={hide}
            className={twMerge(
              "absolute top-0 left-0 w-full h-full bg-black/3 -z-10",
              shadowClassName
            )}
          />
        </div>
      );
    },
    [showing, hide]
  );

  return {
    Modal,
    hide,
    open,
  };
};

export default useModal;
