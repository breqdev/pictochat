import React from "react";
import { Color, COLORS } from "./components/ColorPicker";
import Main from "./pages/Main";
import Welcome from "./pages/Welcome";

const SOCKET_URL =
  (import.meta.env.VITE_APP_SERVER_URL as string) || "ws://127.0.0.1:8080";

function useWebSocket(handleReconnect: (socket: WebSocket) => void) {
  const [ready, setReady] = React.useState(false);
  const [socket, setSocket] = React.useState<WebSocket>(() => {
    const socket = new WebSocket(SOCKET_URL);
    socket.addEventListener("open", () => {
      setReady(true);
    });
    return socket;
  });

  const handleDisconnect = React.useCallback(() => {
    setReady(false);
    setTimeout(() => {
      setSocket(() => {
        const socket = new WebSocket(SOCKET_URL);
        socket.onopen = () => {
          setReady(true);
          handleReconnect(socket);
        };
        return socket;
      });
    }, 500);
  }, [handleReconnect]);

  React.useEffect(() => {
    socket.addEventListener("close", handleDisconnect);

    return () => {
      socket.removeEventListener("close", handleDisconnect);
    };
  }, [socket, handleDisconnect]);

  if (ready) {
    return socket;
  } else {
    return null;
  }
}

export type UserSettings = {
  name: string;
  channel: string;
  color: Color;
};

function App() {
  const [settings, setSettings] = React.useState<UserSettings>({
    name: "",
    channel: "",
    color: COLORS[0],
  });
  const [joined, setJoined] = React.useState(false);

  const handleSocketReconnect = React.useCallback(
    (socket: WebSocket) => {
      if (joined) {
        socket.send(
          JSON.stringify({
            type: "join",
            channel: settings.channel,
            name: settings.name,
          })
        );
      }
    },
    [settings.channel, settings.name, joined]
  );

  const socket = useWebSocket(handleSocketReconnect);

  const joinChannel = React.useCallback(() => {
    if (socket) {
      setJoined(true);
      socket.send(
        JSON.stringify({
          type: "join",
          channel: settings.channel,
          name: settings.name,
        })
      );
    }
  }, [settings.channel, settings.name, socket]);

  if (!joined) {
    return (
      <Welcome
        settings={settings}
        setSettings={setSettings}
        joinChannel={joinChannel}
      />
    );
  } else {
    return <Main settings={settings} socket={socket} />;
  }
}

export default App;
