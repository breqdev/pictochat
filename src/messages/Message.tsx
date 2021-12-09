import React from "react";
import Banner from "./Banner";
import Join from "./Join";

type JoinMessageData = {
  type: "join" | "leave";
  author: string;
};

type UserMessageData = {
  type: "user";
  img: string;
  author: string;
  height: number;
};

export type MessageData =
  | {
      type: "banner";
    }
  | JoinMessageData
  | UserMessageData;

export function MessageBlock({
  children,
  height,
}: {
  children?: React.ReactNode;
  height?: number;
}) {
  return (
    <div
      className={
        "flex-shrink-0 rounded-xl bg-white border-2 border-blue-600 overflow-hidden relative"
      }
      style={{ height: `${(height || 5) * 36}px` }}
    >
      <div className="bg-blue-200 w-24 px-2 py-1 border-b-2 border-r-2 border-blue-600 rounded-br-xl text-blue-600 z-50 relative">
        Brooke
      </div>
      {children}
    </div>
  );
}

export default function Message(props: MessageData) {
  switch (props.type) {
    case "banner":
      return <Banner />;
    case "join":
      return <Join author={props.author} />;
    case "leave":
      return <Join author={props.author} leave />;
    case "user":
      return (
        <MessageBlock height={props.height}>
          <img src={props.img} className="absolute inset-0" />
        </MessageBlock>
      );
  }
}
