"use client";

import { ReactNode } from "react";

export const LinkButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex justify-center px-4 py-2 font-light text-sm cursor-pointer hover:bg-[#ebe9df] rounded"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
