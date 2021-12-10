import React from "react";
import Main from "./pages/Main";
import Welcome from "./pages/Welcome";

function App() {
  const [name, setName] = React.useState("");
  const [channel, setChannel] = React.useState("");

  if (name === "" || channel === "") {
    return <Welcome setName={setName} setChannel={setChannel} />;
  } else {
    return <Main name={name} channel={channel} />;
  }
}

export default App;
