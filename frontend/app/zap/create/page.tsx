"use client";
import { Appbar } from "@/components/Appbar";
import { LinkButton } from "@/components/buttons/LinkButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { ZapCell } from "@/components/ZapCell";
import { useState } from "react";

export default function () {
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedActions, setSelectedActions] = useState<
    {
      availableActionId: string;
      availableActionName: string;
    }[]
  >([]);
  return (
    <div>
      <Appbar />
      <div className="w-full min-h-screen bg-slate-200 flex pt-[-40px] flex-col justify-center">
        <div className="flex justify-center w-full">
          <ZapCell
            name={selectedTrigger ? selectedTrigger : "Trigger"}
            index={1}
            onClick={() => {}}
          />
        </div>
        <div className="flex justify-center w-full py-2">
          {selectedActions.map((action, index) => (
            <div className="pt-2 flex justify-center">
              <ZapCell
                name={action ? action.availableActionName : "Action"}
                index={1 + index}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div>
            <PrimaryButton
              onClick={() => {
                setSelectedActions((a) => [
                  ...a,
                  {
                    index: a.length + 2,
                    availableActionId: "",
                    availableActionName: "",
                    metadata: {},
                  },
                ]);
              }}
            >
              <div className="text-2xl">+</div>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
