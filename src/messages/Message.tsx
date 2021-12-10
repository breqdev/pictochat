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

function MessageBlockLines() {
  return (
    <div className="absolute inset-0 flex flex-col justify-evenly">
      {[...Array(4)].map((_, i) => (
        <hr key={i} className="border-blue-200" />
      ))}
    </div>
  );
}

export const MessageBlock = React.forwardRef(
  (
    {
      children,
      height,
      lines,
      author,
    }: {
      children?: React.ReactNode;
      height?: number;
      lines?: boolean;
      author: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        className={
          "flex-shrink-0 rounded-xl bg-white border-2 border-blue-600 overflow-hidden relative"
        }
        style={{ height: `${(height || 5) * 36}px` }}
        ref={ref}
      >
        <div className="bg-blue-200 w-24 px-2 py-1 border-b-2 border-r-2 border-blue-600 rounded-br-xl text-blue-600 z-50 relative">
          {author}
        </div>
        {children}
        {lines && <MessageBlockLines />}
      </div>
    );
  }
);

const Message = React.forwardRef<HTMLDivElement, MessageData>((props, ref) => {
  switch (props.type) {
    case "banner":
      return <Banner ref={ref} />;
    case "join":
      return <Join author={props.author} ref={ref} />;
    case "leave":
      return <Join author={props.author} leave ref={ref} />;
    case "user":
      return (
        <MessageBlock height={props.height} ref={ref} author={props.author}>
          <img src={props.img} className="absolute inset-0" />
        </MessageBlock>
      );
  }
});

export default Message;
