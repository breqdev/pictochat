import React from "react";

export default function Welcome({
  setName,
  setChannel,
}: {
  setName: (name: string) => void;
  setChannel: (channel: string) => void;
}) {
  const [name, setNameState] = React.useState("");
  const [channel, setChannelState] = React.useState("");

  return (
    <div className="bg-gray-400 h-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl flex flex-col gap-4 items-center">
        <p>enter a name:</p>
        <input
          type="text"
          className="border-2 border-black rounded-full px-4 py-2"
          value={name}
          onChange={(e) => setNameState(e.target.value)}
        />
        <p>enter a channel:</p>
        <input
          type="text"
          className="border-2 border-black rounded-full px-4 py-2"
          value={channel}
          onChange={(e) => setChannelState(e.target.value)}
        />
        <button
          onClick={() => {
            setName(name);
            setChannel(channel);
          }}
          className="w-full bg-blue-200 rounded-full px-4 py-2"
        >
          submit
        </button>
      </div>
    </div>
  );
}
