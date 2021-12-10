import React from "react";
import Top from "./screens/Top";
import Bottom from "./screens/Bottom";
import { MessageData } from "./messages/Message";

function App() {
  const [messages, setMessages] = React.useState<MessageData[]>([
    { type: "banner" },
    { type: "join", author: "Brooke" },
  ]);

  const socket = React.useRef<WebSocket>();

  React.useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocket("wss://chat.breq.dev/socket");
    }

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((messages) => [...messages, data]);
    };

    socket.current.onclose = () => {
      setTimeout(() => {
        socket.current = new WebSocket("wss://chat.breq.dev/socket");
      }, 500);
    };
  }, []);

  const handleMessage = React.useCallback((message: MessageData) => {
    // setMessages((messages) => [...messages, message]);
    socket.current?.send(JSON.stringify(message));
  }, []);

  return (
    <div className="bg-gray-400 h-full flex flex-col gap-4 justify-center">
      <Top messages={messages} />
      <Bottom onMessage={handleMessage} />
    </div>
  );
}

export default App;
