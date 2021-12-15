import React from "react";
import Main from "./pages/Main";
import Welcome from "./pages/Welcome";

function useWebSocket() {
  const socket = React.useRef<WebSocket>();

  const initSocket = React.useCallback(() => {
    socket.current = new WebSocket(
      (import.meta.env.VITE_APP_SERVER_URL as string) || "ws://127.0.0.1:8080"
    );

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

  return socket;
}

function App() {
  const [name, setName] = React.useState("");
  const [channel, setChannel] = React.useState("");

  const socket = useWebSocket();

  const onSetChannel = (channel: string) => {
    setChannel(channel);
    if (socket.current) {
      socket.current.send(JSON.stringify({ type: "join", channel }));
    }
  };

  if (name === "" || channel === "") {
    return <Welcome setName={setName} setChannel={onSetChannel} />;
  } else {
    return <Main name={name} channel={channel} socket={socket} />;
  }
}

export default App;
