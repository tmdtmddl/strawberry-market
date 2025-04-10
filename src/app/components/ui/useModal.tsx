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
      className,
      shadowClassName,
      containerClassName,
    }: {
      className?: string;
      shadowClassName?: string;
      containerClassName?: string;
    } & PropsWithChildren) => {
      return !showing ? null : (
        <div
          className={twMerge(
            "fixed top-0 left-0 w-full h-screen flex justify-center items-center z-10",
            !showing && "hidden",
            containerClassName
          )}
        >
          <div
            className={twMerge(
              "bg-white rounded-2xl duration-300 ease-in-out relative z-10",
              className
            )}
          >
            {children}
          </div>
          <span
            onClick={hide}
            className={twMerge(
              "absolute top-0 left-0 w-full h-full bg-black/3",
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
    open,
    hide,
    showing,
  };
};

export default useModal;
