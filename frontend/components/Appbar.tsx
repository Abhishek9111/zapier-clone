"use client";
import { useRouter } from "@/node_modules/next/navigation";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Appbar = () => {
  const router = useRouter();
  return (
    <div className="flex border-b justify-between p-4">
      <div className="flex flex-col justify-center text-2xl font-extrabold">
        Zapier
      </div>
      <div className="flex space-x-2">
        <LinkButton onClick={() => {}}>Contact sales</LinkButton>
        <LinkButton
          onClick={() => {
            router.push("/login");
          }}
        >
          Login
        </LinkButton>
        <div className="pl-4">
          <PrimaryButton
            onClick={() => {
              router.push("/signup");
            }}
          >
            Signup
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
