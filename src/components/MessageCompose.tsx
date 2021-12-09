import React from "react";
import { MessageBlock, MessageData } from "../messages/Message";
import { ToolState } from "./DrawSidebar";

type ComposeKeyEvent = {
  type: "key";
  key: string;
};

export type ComposeEvent =
  | { type: "clear" }
  | { type: "send" }
  | ComposeKeyEvent;

export type ComposeEventDispatcher = React.MutableRefObject<
  (e: ComposeEvent) => void
>;

const usePersistentCanvas = (
  canvasParent: React.RefObject<HTMLDivElement>,
  zIndex = 0,
  pointerEvents = true
) => {
  const canvas = React.useRef<HTMLCanvasElement>();

  React.useLayoutEffect(() => {
    if (!canvas.current) {
      canvas.current = document.createElement("canvas");
      canvas.current.className = "absolute inset-0 w-full h-full";
      canvas.current.style.zIndex = zIndex.toString();

      if (!pointerEvents) {
        canvas.current.style.pointerEvents = "none";
      }
    }

    canvasParent.current?.appendChild(canvas.current);

    return () => {
      canvasParent.current?.removeChild(canvas.current!);
    };
  }, []);

  React.useLayoutEffect(() => {
    canvas.current!.width = canvas.current!.offsetWidth;
    canvas.current!.height = canvas.current!.offsetHeight;
  }, []);

  return canvas;
};

const useCanvasMouseEvents = (
  canvas: React.RefObject<HTMLCanvasElement | undefined>,
  toolState: ToolState
) => {
  const mouseDown = React.useRef(false);

  const handleMouseDown = (e: MouseEvent) => {
    mouseDown.current = true;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    const rect = canvas.current!.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseUp = () => {
    if (mouseDown.current) {
      mouseDown.current = false;
      const ctx = canvas.current?.getContext("2d");
      ctx?.stroke();
    }
  };

  React.useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (!mouseDown.current) return;

    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = { small: 3, large: 10 }[toolState.size];
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = { pencil: "black", eraser: "white" }[toolState.tool];

    const rect = canvas.current!.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx?.stroke();
  };

  React.useEffect(() => {
    canvas.current?.addEventListener("mousedown", handleMouseDown);
    canvas.current?.addEventListener("mouseout", handleMouseUp);
    canvas.current?.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.current?.removeEventListener("mousedown", handleMouseDown);
      canvas.current?.removeEventListener("mouseout", handleMouseUp);
      canvas.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [toolState]);
};

const useTextLayer = (
  canvasParent: React.RefObject<HTMLDivElement>,
  baseCanvas: React.RefObject<HTMLCanvasElement | undefined>
) => {
  const cursorPos = React.useRef({ x: 105, y: 25 });
  const text = React.useRef<string[]>([]);

  const textCanvas = usePersistentCanvas(canvasParent, 1, false);

  const renderText = () => {
    const ctx = textCanvas.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, textCanvas.current!.width, textCanvas.current!.height);

    let charPos = Object.assign({}, cursorPos.current);

    for (let char of text.current) {
      if (char === "\n") {
        charPos.x = 5;
        charPos.y += 30;
      } else {
        ctx.font = ctx.font.replace(/\d+px/, "20px");
        ctx.fillStyle = "black";
        const width = ctx.measureText(char).width;
        if (charPos.x + width > textCanvas.current!.width) {
          charPos.x = 5;
          charPos.y += 30;
        }
        ctx.fillText(char, charPos.x, charPos.y);
        charPos.x += width;
      }
    }
  };

  const blitDown = () => {
    const destCtx = baseCanvas.current?.getContext("2d");
    if (!destCtx) return;

    if (!textCanvas.current) return;

    destCtx.drawImage(textCanvas.current, 0, 0);

    const srcCtx = textCanvas.current?.getContext("2d");
    if (!srcCtx) return;

    srcCtx.clearRect(
      0,
      0,
      textCanvas.current!.width,
      textCanvas.current!.height
    );
  };

  return {
    dispatchText: (char: string) => {
      if (char.length === 1) {
        text.current.push(char);
        renderText();
      } else if (char === "backspace") {
        text.current.pop();
        renderText();
      }
    },
    dispatchAction: (action: { type: string; x?: number; y?: number }) => {
      switch (action.type) {
        case "clear":
          text.current = [];
          cursorPos.current = { x: 105, y: 25 };
          renderText();
          break;
        case "new":
          blitDown();
          text.current = [];
          renderText();

          if (action.x === undefined || action.y === undefined) {
            cursorPos.current = { x: 105, y: 25 };
          } else {
            cursorPos.current = { x: action.x, y: action.y };
          }
          break;
      }
    },
  };
};

const getMessageHeight = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let height = 0;

  for (let i = 0; i < 5; ++i) {
    const zoneStart = (i * (canvas.height / 5)) | 0;
    const zoneEnd = ((i + 1) * (canvas.height / 5)) | 0;

    zoneLoop: for (let y = zoneStart; y < zoneEnd; ++y) {
      for (let x = 0; x < canvas.width; ++x) {
        const index = (y * canvas.width + x) * 4;
        if (
          (imageData.data[index] !== 255 ||
            imageData.data[index + 1] !== 255 ||
            imageData.data[index + 1] !== 255) &&
          imageData.data[index + 3] !== 0
        ) {
          height = i;
          break zoneLoop;
        }
      }
    }
  }

  return height + 1;
};

export default function MessageCompose({
  toolState,
  dispatch,
  onMessage,
}: {
  toolState: ToolState;
  dispatch: ComposeEventDispatcher;
  onMessage: (message: MessageData) => void;
}) {
  const canvasParent = React.useRef<HTMLDivElement>(null);
  const canvas = usePersistentCanvas(canvasParent);
  useCanvasMouseEvents(canvas, toolState);
  const { dispatchText, dispatchAction } = useTextLayer(canvasParent, canvas);

  React.useEffect(() => {
    dispatch.current = (e: ComposeEvent) => {
      if (!canvas.current) return;
      const ctx = canvas.current.getContext("2d");
      if (!ctx) return;

      switch (e.type) {
        case "clear":
          ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
          dispatchAction({ type: "clear" });
          break;
        case "key":
          dispatchText(e.key);
          break;
        case "send":
          dispatchAction({ type: "new" });

          const height = getMessageHeight(canvas.current);

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = canvas.current.width;
          tempCanvas.height = canvas.current.height * (height / 5);

          const tempCtx = tempCanvas.getContext("2d");
          if (!tempCtx) return;

          tempCtx.drawImage(canvas.current, 0, 0);

          const data = tempCanvas.toDataURL("image/png");
          if (data) {
            onMessage({
              type: "user",
              author: "Brooke",
              img: data,
              height,
            });
          }

          ctx.clearRect(0, 0, canvas.current!.width, canvas.current!.height);
          break;
        default:
          console.warn("Unknown compose event", e);
      }
    };
  }, []);

  return (
    <MessageBlock>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();

          if (!canvas.current) return;
          const canvasRect = canvas.current.getBoundingClientRect();

          const ctx = canvas.current.getContext("2d");
          const textWidth = ctx?.measureText(
            e.dataTransfer.getData("text")
          ).width;

          dispatchAction({
            type: "new",
            x: e.clientX - canvasRect.left - (textWidth || 0) / 2,
            y: e.clientY - canvasRect.top + 10,
          });
          dispatchText(e.dataTransfer.getData("text"));
        }}
        ref={canvasParent}
      />
    </MessageBlock>
  );
}
