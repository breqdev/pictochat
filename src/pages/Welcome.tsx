import {
  faPencilAlt,
  faTh,
  faUserEdit,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEventHandler } from "react";
import { UserSettings } from "../App";
import ColorPicker from "../components/ColorPicker";

import welcome0 from "../sounds/welcome0.wav";
import welcome1 from "../sounds/welcome1.wav";
import welcome2 from "../sounds/welcome2.wav";

const SOUNDS = [welcome0, welcome1, welcome2].map((s) => new Audio(s));

function MenuPrompt({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: IconDefinition;
}) {
  return (
    <div className="bg-gray-300 rounded p-1 flex gap-2 items-center">
      <div className="ml-2 bg-green-400 border-2 border-white flex justify-center items-center w-20 h-20 text-4xl text-white">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <h2 className="ml-2 text-xl">{title}</h2>
        <p className="border border-white bg-black px-2 py-3 rounded text-white text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

function Input({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  const element = React.useRef<HTMLInputElement>(null);

  // There is only ever one Input on the screen at a time, therefore it is okay
  // for us to steal focus on mount.
  React.useEffect(() => {
    element.current?.focus();
  }, []);

  return (
    <input
      type="text"
      ref={element}
      className="bg-gray-600 text-white outline-none border-black focus:border-yellow-500 border-2 focus:border-4 focus:-my-0.5 py-1 px-2 w-64 mx-auto"
      value={value}
      onChange={onChange}
    />
  );
}

export default function Welcome({
  settings,
  setSettings,
  joinChannel,
}: {
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  joinChannel: () => void;
}) {
  const [page, setPage] = React.useState(0);
  const confirmButton = React.useRef<HTMLButtonElement>(null);

  // We can't use a <input type="submit" /> because we need to draw the "(A)"
  // icon inside the button. But we still need the form to be keyboard
  // accessible. Thus, we approximate the behavior of the enter key ourselves.

  React.useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        confirmButton.current?.click();
      }
    };

    document.addEventListener("keydown", keyHandler);

    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="bg-gray-400 h-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl flex flex-col gap-8 w-full max-w-lg">
        <h1 className="text-5xl text-center">PICTOCHAT</h1>
        <div className="flex flex-col h-80 justify-around">
          {page === 0 && (
            <>
              <MenuPrompt
                title="User Name"
                description="Enter your nickname."
                icon={faUserEdit}
              />
              <Input
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
              />
            </>
          )}
          {page === 1 && (
            <>
              <MenuPrompt
                title="Color"
                description="Select your favorite color."
                icon={faTh}
              />
              <ColorPicker
                color={settings.color}
                setColor={(c) => setSettings({ ...settings, color: c })}
              />
            </>
          )}
          {page === 2 && (
            <>
              <MenuPrompt
                title="Chat Room"
                description="Choose a Chat Room to join."
                icon={faPencilAlt}
              />
              <Input
                value={settings.channel}
                onChange={(e) =>
                  setSettings({ ...settings, channel: e.target.value })
                }
              />
            </>
          )}
        </div>
        <button
          ref={confirmButton}
          onClick={() => {
            SOUNDS[page].play();

            confirmButton.current?.blur();
            if (page < 2) {
              setPage(page + 1);
            } else {
              joinChannel();
            }
          }}
          className="bg-gradient-to-b from-gray-300 to-gray-200 border-4 border-white focus-visible:border-black focus-visible:border-dashed outline-none self-center py-1 px-12 flex gap-2 items-center"
        >
          <div className="bg-black text-gray-200 rounded-full h-5 w-5 flex justify-center items-center text-sm">
            A
          </div>
          Confirm
        </button>
      </div>
    </div>
  );
}
