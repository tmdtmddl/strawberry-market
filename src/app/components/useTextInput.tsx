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
  onChangText?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
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
      label,
      labelClassName,
      containerClassName,
      contentClassName,
      onChangText,
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
          <div className={contentClassName}>
            <input
              {...props}
              id={props?.id ?? inputId}
              onChange={(e) => {
                if (onChangText) {
                  return onChangText(e.target.value, e);
                }
                if (props?.onChange) {
                  props.onChange(e);
                }
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              ref={ref}
              className={twMerge("outline-none", props?.className)}
            />
          </div>
        </div>
      );
    },
    [inputId]
  );
  return { TextInput, focus };
};

export default useTextInput;
