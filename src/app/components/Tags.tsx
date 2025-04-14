"use client";

import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Form = ({
  Submit,
  btnClassName,
  ...props
}: ComponentProps<"form"> & { Submit?: ReactNode; btnClassName?: string }) => {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        if (props.onSubmit) {
          props.onSubmit(e);
        }
      }}
      className={twMerge(
        "max-w-100 mx-auto flex flex-col gap-y-2.5 w-full",
        props?.className
      )}
    >
      {props?.children}
      <div className={twMerge("mt-2.5 flex-row", btnClassName)}>{Submit}</div>
    </form>
  );
};
