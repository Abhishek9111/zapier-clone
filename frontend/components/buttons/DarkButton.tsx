import { ReactNode } from "react";

export const DarkButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
  size?: "big" | "small";
}) => {
  return (
    <div
      className={` px-8 py-2 bg-purple-800 border border-black text-white rounded hover:shadow-md cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
