import { Spinner } from "./ui/spinner";

export const LoadingOnClick = ({
  size,
}: {
  size: "small" | "medium" | "big";
}) => {
  return (
    <div
      className={`flex items-center justify-center absolute top-0 left-0 h-full bg-black/60 text-white z-10 ${
        size === "small" ? "w-auto aspect-square h-12" : "w-full"
      }`}
    >
      {size === "small" ? (
        <Spinner className="size-6" />
      ) : size === "medium" ? (
        <Spinner className="size-8" />
      ) : size === "big" ? (
        <Spinner className="size-10" />
      ) : (
        <p>Invalid input</p>
      )}
    </div>
  );
};
