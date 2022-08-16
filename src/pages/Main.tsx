import React from "react";
import Top from "../screens/Top";
import Bottom from "../screens/Bottom";
import { MessageData } from "../messages/Message";
import { UserSettings } from "../App";

export default function Main({
  settings,
  socket,
}: {
  settings: UserSettings;
  socket: WebSocket | null;
}) {
  const [messages, setMessages] = React.useState<MessageData[]>([
    { type: "banner" },
  ]);
  const [currentMessage, setCurrentMessage] = React.useState(-1);

  const handleSend = React.useCallback(
    (message: MessageData) => {
      socket?.send(
        JSON.stringify({ type: "message", channel: settings.channel, message })
      );
    },
    [settings.channel, socket]
  );

  const handleReceive = React.useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.type === "message") {
      setMessages((messages) => [...messages, data.message]);
    }
  }, []);

  React.useEffect(() => {
    socket?.addEventListener("message", handleReceive);

    return () => {
      socket?.removeEventListener("message", handleReceive);
    };
  }, [socket, handleReceive]);

  return (
    <div className="bg-gray-400 h-full flex flex-col gap-4 justify-center">
      <Top messages={messages} currentMessage={currentMessage} />
      <Bottom
        onMessage={handleSend}
        messages={messages}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        settings={settings}
      />
    </div>
  );
}
