import React from "react";
import Screen from "./Screen";
import Keyboard from "../components/Keyboard";
import MessageActions from "../components/MessageActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Icon from "../components/Icon";
import DrawSidebar, { ToolState } from "../components/DrawSidebar";
import MessageCompose, {
  ComposeEvent,
  ComposeEventDispatcher,
} from "../components/MessageCompose";
import { MessageData } from "../messages/Message";
import { UserSettings } from "../App";

export default function Bottom({
  onMessage,
  messages,
  currentMessage,
  setCurrentMessage,
  settings,
}: {
  onMessage: (message: MessageData) => void;
  messages: MessageData[];
  currentMessage: number;
  setCurrentMessage: React.Dispatch<React.SetStateAction<number>>;
  settings: UserSettings;
}) {
  const [toolState, setToolState] = React.useState<ToolState>({
    tool: "pencil",
    size: "large",
  });
  const dispatchComposeEvent = React.useRef<(e: ComposeEvent) => void>(
    () => {}
  ) as ComposeEventDispatcher;

  return (
    <Screen>
      <DrawSidebar
        toolState={toolState}
        setToolState={setToolState}
        setCurrentMessage={setCurrentMessage}
        messages={messages}
        color={settings.color}
      />
      <div className="bg-white flex flex-col w-full">
        <div className="flex justify-end p-1">
          <Icon borderColor="border-black" backgroundColor="bg-gray-200">
            <FontAwesomeIcon icon={faTimes} className="text-black" />
          </Icon>
        </div>
        <div className="flex-grow bg-gray-300 rounded-tl-xl rounded-bl-xl flex flex-col w-full p-2 pr-1 gap-2">
          <MessageCompose
            toolState={toolState}
            dispatch={dispatchComposeEvent}
            onMessage={onMessage}
            currentMessage={
              messages[
                currentMessage === -1 ? messages.length - 1 : currentMessage
              ]
            }
            settings={settings}
          />
          <div className="flex gap-2">
            <Keyboard dispatch={dispatchComposeEvent} />
            <MessageActions dispatch={dispatchComposeEvent} />
          </div>
        </div>
        <div className="bg-white h-4" />
      </div>
    </Screen>
  );
}
