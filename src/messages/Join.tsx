import React from "react";

const Join = React.forwardRef(
  (
    {
      author,
      leave,
      channel,
    }: {
      author: string;
      leave?: boolean;
      channel: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      className="bg-black border-white border-2 px-2 py-1 rounded-xl"
      ref={ref}
    >
      <span className="text-yellow-200">
        Now {leave ? "leaving " : "entering "}
        <span className="border border-yellow-200 px-1 mr-px text-sm">
          {channel}
        </span>
        :
      </span>
      <span className="text-gray-100"> {author}</span>
    </div>
  )
);

export default Join;
