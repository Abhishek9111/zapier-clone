"use client";

import { useRouter } from "@/node_modules/next/navigation";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { Feature } from "./Feature";

export const Hero = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-center">
        <div className="text-4xl font-semibold text-center pt-8 max-w-xl">
          Automate as fast as you type
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-xl font-normal text-center pt-8 max-w-2xl">
          AI gives you automation superpowers, and Zapier puts them to work.
          Pairing AI and Zapier helps you turn ideas into workflows and bots
          that work for you.
        </div>
      </div>
      <div className="flex justify-center pt-4">
        <div className="flex ">
          <PrimaryButton
            onClick={() => {
              router.push("/signup");
            }}
            size="big"
          >
            Get started free
          </PrimaryButton>
          <div className="pl-4">
            <SecondaryButton onClick={() => {}} size="big">
              Contact sales
            </SecondaryButton>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4 space-x-4">
        <Feature title={"Free forever "} subTitle={"for core features"} />
        <Feature title={"More apps "} subTitle={"than any other platform"} />
        <Feature title={"Cutting-edge "} subTitle={"AI features"} />
      </div>
    </div>
  );
};
