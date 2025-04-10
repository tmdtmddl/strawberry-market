"use client";

import {
  ChangeEvent,
  ComponentProps,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ComponentProps<"input"> {
  label?: string;
  labelClassName?: string;
  contentClassName?: string;
  containerClassName?: string;
  messageClassName?: string;
  onChangeText?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  message?: string | null;
}

const useTextInput = () => {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const focus = useCallback(
    () => setTimeout(() => ref.current?.focus(), 100),
    []
  );
  const inputId = useId();

  const TextInput = useCallback(
    ({
      message,
      label,
      labelClassName,
      onChangeText,
      contentClassName,
      containerClassName,
      messageClassName,
      ...props
    }: Props) => {
      return (
        <div className={twMerge("gap-1", containerClassName)}>
          {label && (
            <label
              htmlFor={props?.id ?? inputId}
              className={twMerge("text-gray-500 text-xs", labelClassName)}
            >
              {label}
            </label>
          )}
          <div className={twMerge("h-12", contentClassName)}>
            <input
              {...props}
              id={props?.id ?? inputId}
              onChange={(e) => {
                if (onChangeText) {
                  return onChangeText(e.target.value, e);
                }
                if (props?.onChange) {
                  props.onChange(e);
                }
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={twMerge(
                "flex-1 w-full outline-none px-2.5 rounded border border-gray-200 focus:text-theme focus:border-theme",
                props?.className
              )}
              ref={ref}
            />
          </div>
          {message && (
            <label
              htmlFor={props?.id ?? inputId}
              className={twMerge("text-red-500 text-xs", messageClassName)}
            >
              {message}
            </label>
          )}
        </div>
      );
    },
    [inputId]
  );

  return { focused, ref, focus, TextInput };
};

export default useTextInput;
