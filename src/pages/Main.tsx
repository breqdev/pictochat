import React from "react";
import Top from "../screens/Top";
import Bottom from "../screens/Bottom";
import { MessageData } from "../messages/Message";

export default function Main({
  name,
  channel,
  socket,
}: {
  name: string;
  channel: string;
  socket: React.RefObject<WebSocket | undefined>;
}) {
  const [messages, setMessages] = React.useState<MessageData[]>([
    { type: "banner" },
    { type: "join", author: name, channel },
  ]);
  const [currentMessage, setCurrentMessage] = React.useState(-1);

  const handleMessage = React.useCallback(
    (message: MessageData) => {
      // setMessages((messages) => [...messages, message]);
      socket.current?.send(
        JSON.stringify({ type: "message", channel, message })
      );
    },
    [channel, socket]
  );

  React.useEffect(() => {
    if (socket.current) {
      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          setMessages((messages) => [...messages, data.message]);
        }
      };
    }
  });

  return (
    <div className="bg-gray-400 h-full flex flex-col gap-4 justify-center">
      <Top messages={messages} currentMessage={currentMessage} />
      <Bottom
        onMessage={handleMessage}
        messages={messages}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        name={name}
      />
    </div>
  );
}
