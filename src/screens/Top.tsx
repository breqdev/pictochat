import React from "react";
import Sidebar from "../components/Sidebar";
import Screen from "./Screen";
import Icon from "../components/Icon";
import Banner from "../messages/Banner";
import Join from "../messages/Join";
import Message, { MessageData } from "../messages/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignal } from "@fortawesome/free-solid-svg-icons";

export default function Top({ messages }: { messages: MessageData[] }) {
  return (
    <Screen>
      <Sidebar>
        <Icon borderColor="border-green-500" backgroundColor="bg-black">
          {/* Connection Strength Icon */}
          <FontAwesomeIcon icon={faSignal} />
        </Icon>
        <div className="flex-grow" />
        <Icon borderColor="border-blue-400" backgroundColor="bg-gray-500">
          {/* Three Lines Icon */}
          <FontAwesomeIcon icon={faBars} />
        </Icon>
        <Icon borderColor="border-blue-400" backgroundColor="bg-gray-500">
          A
        </Icon>
      </Sidebar>
      <div className="ml-1 flex-grow flex flex-col justify-end p-1 gap-1 overflow-hidden">
        {messages.map((message, index) => (
          <Message key={index} {...message} />
        ))}
      </div>
    </Screen>
  );
}
