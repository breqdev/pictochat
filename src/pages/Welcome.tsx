import {
  faPencilAlt,
  faTh,
  faUserEdit,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEventHandler } from "react";
import { UserSettings } from "../App";
import ColorPicker, { Color, COLORS } from "../components/ColorPicker";

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
    <div className="bg-gray-300 rounded p-1 flex gap-1 items-center">
      <div className="ml-1 bg-green-400 border-2 border-white flex justify-center items-center w-16 h-16 text-3xl text-white">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <h2 className="ml-1 text-lg">{title}</h2>
        <p className="border border-white bg-black px-1 py-2 rounded text-white">
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
  return (
    <input
      type="text"
      className="bg-gray-600 text-white border-black border-2 py-1 px-2"
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
  return (
    <div className="bg-gray-400 h-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl flex flex-col gap-4">
        <h1 className="text-3xl text-center">PICTOCHAT</h1>
        <MenuPrompt
          title="User Name"
          description="Enter your nickname."
          icon={faUserEdit}
        />
        <Input
          value={settings.name}
          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
        />
        <MenuPrompt
          title="Color"
          description="Select your favorite color."
          icon={faTh}
        />
        <ColorPicker
          color={settings.color}
          setColor={(c) => setSettings({ ...settings, color: c })}
        />
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
        <button
          onClick={() => {
            joinChannel();
          }}
          className="bg-gradient-to-b from-gray-300 to-gray-200 self-center py-1 px-12 flex gap-2 items-center"
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
