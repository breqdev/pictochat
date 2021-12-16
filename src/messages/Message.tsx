import React from "react";
import { Color, PALETTES } from "../components/ColorPicker";
import Banner from "./Banner";
import Join from "./Join";

type JoinMessageData = {
  type: "join" | "leave";
  author: string;
  channel: string;
};

type UserMessageData = {
  type: "user";
  img: string;
  author: string;
  color: Color;
  height: number;
};

export type MessageData =
  | {
      type: "banner";
    }
  | JoinMessageData
  | UserMessageData;

function MessageBlockLines({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-evenly">
      {[...Array(4)].map((_, i) => (
        <hr key={i} style={{ borderColor: color }} />
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
      color,
    }: {
      children?: React.ReactNode;
      height?: number;
      lines?: boolean;
      author: string;
      color: Color;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { fg, bg } = PALETTES[color];

    return (
      <div
        className={
          "flex-shrink-0 rounded-xl bg-white border-2 overflow-hidden relative"
        }
        style={{ height: `${(height || 5) * 36}px`, borderColor: fg }}
        ref={ref}
      >
        <div
          className="min-w-24 w-max px-2 py-1 border-b-2 border-r-2 rounded-br-xl z-50 relative"
          style={{
            borderColor: fg,
            color: fg,
            backgroundColor: bg,
          }}
        >
          {author}
        </div>
        {children}
        {lines && <MessageBlockLines color={bg} />}
      </div>
    );
  }
);

const Message = React.forwardRef<HTMLDivElement, MessageData>((props, ref) => {
  switch (props.type) {
    case "banner":
      return <Banner ref={ref} />;
    case "join":
      return <Join author={props.author} channel={props.channel} ref={ref} />;
    case "leave":
      return (
        <Join author={props.author} channel={props.channel} leave ref={ref} />
      );
    case "user":
      return (
        <MessageBlock
          height={props.height}
          ref={ref}
          author={props.author}
          color={props.color}
        >
          <img src={props.img} className="absolute inset-0" />
        </MessageBlock>
      );
  }
});

export default Message;
