import { PiSpinnerBallFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";

interface LoadingProps {
  fixed?: boolean;
  divClassName?: string;
  iconClassName?: string;
  messageClassName?: string;

  message?: string;
}

const Loading = ({
  divClassName,
  fixed,
  iconClassName,
  message,
  messageClassName,
}: LoadingProps) => {
  return (
    <div
      className={twMerge(
        "absolute top-[50%] left-[50%] size-full flex flex-col gap-y-2.5 items-center justify-center",
        fixed ? "fixed top-0 left-0 w-screen h-screen" : "translate-[-50%]",
        divClassName
      )}
    >
      <PiSpinnerBallFill
        className={twMerge(
          "text-6xl animate-spin text-pink-500",
          iconClassName
        )}
      />
      <p className={twMerge("text-xl animate-pulse", messageClassName)}>
        {message ?? "is loading..."}
      </p>
    </div>
  );
};

export default Loading;
