import React from "react";
import { Color, COLORS } from "./components/ColorPicker";
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

  const socket = useWebSocket();

  const joinChannel = React.useCallback(() => {
    setJoined(true);
    if (socket.current) {
      socket.current.send(
        JSON.stringify({ type: "join", channel: settings.channel })
      );
    }
  }, [settings.channel, socket]);

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
