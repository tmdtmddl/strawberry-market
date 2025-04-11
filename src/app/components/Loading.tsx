import { HTMLAttributes } from "react";
import { ImSpinner5 } from "react-icons/im";
import { twMerge } from "tailwind-merge";

interface Props {
  container?: string;
  wrap?: string;
  icon?: string;
  message?: string;
  messageClassName?: string;
}

const Loading = ({
  container,
  icon,
  message,
  messageClassName,
  wrap,
}: Props) => {
  return (
    <div
      className={twMerge(
        "modal con z-50 justify-center items-center",
        container
      )}
    >
      <div
        className={twMerge(
          "items-center",
          "bg-white p-10 border border-gray-200 shadow-xl rounded-2xl",
          wrap
        )}
      >
        <ImSpinner5
          className={twMerge("text-4xl animate-spin text-theme", icon)}
        />
        <p
          className={twMerge(
            "font-light animate-pulse text-theme",
            messageClassName
          )}
        >
          {message ?? "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default Loading;
