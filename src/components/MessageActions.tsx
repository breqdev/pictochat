import {
  faDownload,
  faSpinner,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ComposeEvent, ComposeEventDispatcher } from "./MessageCompose";

function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div className="aspect-w-4 aspect-h-3 bg-gray-200">
      <button onClick={onClick}>{children}</button>
    </div>
  );
}

export default function MessageActions({
  dispatch,
}: {
  dispatch: ComposeEventDispatcher;
}) {
  return (
    <div className="flex flex-col border-black bg-black gap-0.5 border-t-2 border-l-2 border-b-2 rounded-tl-xl rounded-bl-xl w-20 overflow-hidden -mr-1 text-3xl">
      <Button onClick={() => dispatch.current?.({ type: "send" })}>
        <div className="flex flex-col items-center justify-end h-full">
          <FontAwesomeIcon icon={faUpload} />
          <span className="text-base">SEND</span>
        </div>
      </Button>
      <Button>
        <FontAwesomeIcon icon={faDownload} />
        {/* https://en-americas-support.nintendo.com/app/answers/detail/a_id/4125/~/how-to-copy-and-use-a-previous-message-in-pictochat */}
      </Button>
      <Button onClick={() => dispatch.current?.({ type: "clear" })}>
        <FontAwesomeIcon icon={faSpinner} />
        {/* clear button -- needs better icon */}
      </Button>
    </div>
  );
}
