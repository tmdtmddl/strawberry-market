import { twMerge } from "tailwind-merge";

//
export const TextInput = ({
  label,
  labelClassName,
  divClassName,
  message,
  ...props
}: React.ComponentProps<"input"> & {
  label?: string;
  labelClassName?: string;
  divClassName?: string;
  message?: string | null;
}) => {
  return (
    <div className={twMerge("flex flex-col gap-y-1", divClassName)}>
      {label && (
        <label
          htmlFor={props?.id ?? props?.name}
          className={twMerge("text-sm text-gray-500", labelClassName)}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        type="text"
        id={props?.id ?? props?.name}
        className={twMerge(
          "border border-pink-200 rounded h-12 px-2.5 outline-none bg-pink-50 focus:text-pink-500 w-full transition focus:bg-transparent focus:border-pink-500",
          props?.className
        )}
      />
      {message && (
        <label
          htmlFor={props?.id ?? props?.name}
          className={twMerge("text-red", labelClassName)}
        >
          {message}
        </label>
      )}
    </div>
  );
};

//! preventDefault () ,cn=>flex,rowgap
export const Form = (props: React.ComponentProps<"form">) => (
  <form
    {...props}
    onSubmit={(e) => {
      e.preventDefault();
      if (props.onSubmit) {
        props.onSubmit(e);
      }
    }}
    className={twMerge("flex flex-col gap-y-2.5", props.className)}
  />
);

export const SubmitButton = ({
  buttonClassName,
  ...props
}: React.ComponentProps<"button"> & { buttonClassName?: string }) => (
  <button
    {...props}
    className={twMerge(
      " bg-pink-500 text-white p-2.5 rounded h-12 ",
      buttonClassName
    )}
  />
);
