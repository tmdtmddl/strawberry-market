import { twMerge } from "tailwind-merge";

// React.ComponentProps<"input">=> input 태그에 쓰는 props 타입을 자동으로 가져옴.
//타입에 명시한 전체 속성들 중, 직접 꺼낸 애들을 제외한 나머지를 props가 다 가져간다
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
          className={twMerge("text-xs text-gray-500", labelClassName)}
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
          className={twMerge("text-red-500 text-xs", labelClassName)}
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

      //props로 받은 onSubmit 함수가 있으면 실행.
      if (props.onSubmit) {
        props.onSubmit(e);
      }
    }}
    className={twMerge("flex flex-col gap-y-2.5", props.className)}
  />
);

//React.ComponentProps<"button">: 기본 버튼 속성들 자동 포함.
export const SubmitButton = ({
  buttonClassName,
  ...props
}: React.ComponentProps<"button"> & { buttonClassName?: string }) => (
  <button
    {...props}
    className={twMerge(
      "text-sm rounded p-2.5 bg-pink-500 text-white h-12",
      buttonClassName
    )}
  />
);
