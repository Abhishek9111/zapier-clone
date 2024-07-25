"use client";
import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { useState } from "react";
import axios from "@/node_modules/axios/index";

import { BACKEND_URL } from "../config";
import { Router } from "express";
import { useRouter } from "@/node_modules/next/navigation";

export default function () {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="">
      <Appbar />
      <div className="flex justify-center">
        <div className="flex pt-8 max-w-4xl">
          <div className="flex-1 pt-20 px-4">
            <div className="font-bold text-2xl">
              Join millions worldwide who automate their work using Zapier.
            </div>
            <div className="pt-6 space-y-2">
              <CheckFeature label={"Easy setup, no coding required"} />
              <CheckFeature label={"Free forever for core features"} />
              <CheckFeature label={"14-day trial of premium features & apps"} />
            </div>
          </div>
          <div className="flex-1 pt-12 px-4 border-gray-100 rounded shadow pb-12">
            <Input
              type={"text"}
              label={"Work Email"}
              placeholder={"Your email"}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <Input
              type={"password"}
              label={"Password"}
              placeholder={"*******"}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="pt-4">
              <PrimaryButton
                onClick={async () => {
                  const res = await axios.post(
                    `${BACKEND_URL}/api/v1/user/signin`,
                    {
                      username: email,
                      password,
                    }
                  );
                  localStorage.setItem("token", res.data.token);
                  router.push("/dashboard");
                }}
                size="big"
              >
                Login
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
