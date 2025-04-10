"use client";

import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Form = ({
  Submit,
  ...props
}: ComponentProps<"form"> & { Submit?: ReactNode }) => {
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
        "max-w-100 mx-auto flex flex-col gap-y-2.5",
        props?.className
      )}
    >
      {props?.children}
      <div className="mt-2.5 flex-row">{Submit}</div>
    </form>
  );
};
