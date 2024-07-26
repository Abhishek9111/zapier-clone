"use client";
import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { LinkButton } from "@/components/buttons/LinkButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { ZapCell } from "@/components/ZapCell";
import axios from "@/node_modules/axios/index";
import { useRouter } from "@/node_modules/next/navigation";
import { useEffect, useState } from "react";

function useAvailableActionsAndTriggers() {
  const [availableActions, setAvailableActions] = useState([]);
  const [availableTriggers, setAvailableTriggers] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/trigger/available`)
      .then((x) => setAvailableTriggers(x.data.availableTriggers));
    axios
      .get(`${BACKEND_URL}/api/v1/action/available`)
      .then((x) => setAvailableActions(x.data.availableActions));
  }, []);
  return { availableActions, availableTriggers };
}

export default function () {
  const { availableActions, availableTriggers } =
    useAvailableActionsAndTriggers();
  const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string | undefined;
    name: string | undefined;
  }>();
  const [selectedActions, setSelectedActions] = useState<
    {
      index: number;
      availableActionId: string | undefined;
      availableActionName: string | undefined;
      metadata: string;
    }[]
  >([]);
  const router = useRouter();
  const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(
    null
  );
  return (
    <div>
      <Appbar />
      <div className="flex justify-end bg-slate-200 pt-2">
        <PrimaryButton
          onClick={async () => {
            if (!selectedTrigger?.id) {
              return;
            }
            const res = await axios.post(
              `${BACKEND_URL}/api/v1/zap`,
              {
                availableTriggerId: selectedTrigger.id,
                triggerMetadata: {},
                actions: selectedActions.map((a) => ({
                  availableActionId: a.availableActionId,
                  actionMetadata: a?.metadata,
                })),
              },
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            );

            router.push("/dashboard");
          }}
        >
          Publish
        </PrimaryButton>
      </div>
      <div className="w-full min-h-screen bg-slate-200 flex pt-[-40px] flex-col justify-center">
        <div className="flex justify-center w-full">
          <ZapCell
            name={selectedTrigger ? selectedTrigger.name : "Trigger"}
            index={1}
            onClick={() => {
              setSelectedModalIndex(1);
            }}
          />
        </div>
        <div
          className="flex flex-col
         justify-center w-full py-2"
        >
          {selectedActions.map((action, index) => (
            <div className="pt-2 flex justify-center">
              <ZapCell
                name={action ? action.availableActionName : "Action"}
                index={2 + index}
                onClick={() => {
                  setSelectedModalIndex(action.index);
                }}
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
      {selectedModalIndex && (
        <Modal
          availableItems={
            selectedModalIndex == 1 ? availableTriggers : availableActions
          }
          onSelect={(props: null | { name: string; id: string }) => {
            if (props == null) {
              setSelectedModalIndex(null);
              null;
            }
            if (selectedModalIndex == 1) {
              setSelectedTrigger({
                id: props?.id,
                name: props?.name,
              });
            } else {
              setSelectedActions((a) => {
                let newActions = [...a];
                newActions[selectedModalIndex - 2] = {
                  index: selectedModalIndex,
                  availableActionId: props?.id,
                  availableActionName: props?.name,
                };
                return newActions;
              });
            }
            setSelectedModalIndex(null);
          }}
          index={selectedModalIndex}
        />
      )}
    </div>
  );
}

function Modal({
  index,
  availableItems,
  onSelect,
}: {
  index: number;
  availableItems: { id: string; name: string; image: string }[];
  onSelect: (props: null | { name: string; id: string }) => void;
}) {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] bg-slate-500 max-h-full flex bg-opacity-80">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow ">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900 ">
              Select {index == 1 ? "Trigger" : "Action"}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              data-modal-hide="default-modal"
              onClick={() => {
                onSelect(null);
              }}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <div className="p-4 md:p-5 space-y-4">Tesst</div> */}
          <div className=" flex flex-col items-center space-y-2 justify-start p-4 md:p-5 border-t border-gray-200 rounded-b ">
            {availableItems.map(({ name, image, id }) => {
              return (
                <div
                  className="flex w-full border hover:bg-gray-100"
                  onClick={() => {
                    onSelect({ id, name });
                  }}
                >
                  <p className="p-2 flex space-x-1">
                    <img className="mr-2" src={image} width={30} />
                    {name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
