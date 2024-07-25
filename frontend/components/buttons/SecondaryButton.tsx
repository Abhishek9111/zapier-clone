import { ReactNode } from "react";

export const SecondaryButton = ({
  children,
  onClick,
  size = "small",
}: {
  children: ReactNode;
  onClick: () => void;
  size?: "big" | "small";
}) => {
  return (
    <div
      className={`${size == "small" ? "text-sm" : "text-xl"} ${
        size == "small" ? "px-8 py-2" : "px-10 py-6"
      } bg-white border border-black text-black rounded-full hover:shadow-md cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
