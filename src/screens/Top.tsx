import React from "react";
import Sidebar from "../components/Sidebar";
import Screen from "./Screen";
import Icon from "../components/Icon";
import Message, { MessageData } from "../messages/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignal } from "@fortawesome/free-solid-svg-icons";

export default function Top({
  messages,
  currentMessage,
}: {
  messages: MessageData[];
  currentMessage: number;
}) {
  const messageContainerRef = React.useRef<HTMLDivElement>(null);
  const currentMessageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messageContainerRef.current && currentMessageRef.current) {
      messageContainerRef.current.scrollTo({
        top:
          currentMessageRef.current.offsetTop +
          currentMessageRef.current.clientHeight +
          10 -
          messageContainerRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  });

  return (
    <Screen>
      <Sidebar>
        <Icon borderColor="border-green-500" backgroundColor="bg-black">
          <FontAwesomeIcon icon={faSignal} />
        </Icon>
        <div className="flex-grow" />
        <Icon borderColor="border-blue-400" backgroundColor="bg-gray-500">
          <FontAwesomeIcon icon={faBars} />
        </Icon>
        <Icon borderColor="border-blue-400" backgroundColor="bg-gray-500">
          A
        </Icon>
      </Sidebar>
      <div
        className="ml-1 flex-grow flex flex-col px-1 py-2 gap-2 overflow-y-hidden"
        ref={messageContainerRef}
      >
        <div className="flex-shrink-0 h-[9999px]" />
        {messages.map((message, index) => {
          const trueCurrent =
            currentMessage === -1 ? messages.length - 1 : currentMessage;

          return trueCurrent === index ? (
            <Message key={index} ref={currentMessageRef} {...message} />
          ) : (
            <Message key={index} {...message} />
          );
        })}
      </div>
    </Screen>
  );
}
