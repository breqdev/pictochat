import React from "react";
import Top from "../screens/Top";
import Bottom from "../screens/Bottom";
import { MessageData } from "../messages/Message";

export default function Main({
  name,
  channel,
}: {
  name: string;
  channel: string;
}) {
  const [messages, setMessages] = React.useState<MessageData[]>([
    { type: "banner" },
    { type: "join", author: name },
  ]);
  const [currentMessage, setCurrentMessage] = React.useState(-1);

  const socket = React.useRef<WebSocket>();

  const initSocket = React.useCallback(() => {
    socket.current = new WebSocket("wss://chat.breq.dev/socket");
    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((messages) => [...messages, data]);
    };

    socket.current.onclose = () => {
      setTimeout(() => {
        initSocket();
      }, 500);
    };
  }, []);

  React.useEffect(() => {
    if (!socket.current) {
      initSocket();
    }
  }, [initSocket]);

  const handleMessage = React.useCallback(
    (message: MessageData) => {
      // setMessages((messages) => [...messages, message]);
      socket.current?.send(JSON.stringify({ channel, ...message }));
    },
    [channel]
  );

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
