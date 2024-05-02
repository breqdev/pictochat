import React from "react";
import { UserSettings } from "../App";
import { MessageBlock, MessageData } from "../messages/Message";
import { ToolState } from "./DrawSidebar";

import dropWav from "../sounds/drop.wav";
const dropAudio = new Audio(dropWav);

type ComposeKeyEvent = {
  type: "key";
  key: string;
};

export type ComposeEvent =
  | { type: "clear" }
  | { type: "send" }
  | { type: "copy" }
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

    const canvasParentElement = canvasParent.current;
    const canvasRefElement = canvas.current;
    return () => {
      canvasParentElement?.removeChild(canvasRefElement);
    };
  }, [canvasParent, pointerEvents, zIndex]);

  React.useLayoutEffect(() => {
    if (canvas.current) {
      canvas.current.width = canvas.current.offsetWidth;
      canvas.current.height = canvas.current.offsetHeight;
    }
  }, []);

  return canvas;
};

const useCanvasMouseEvents = (
  canvas: React.RefObject<HTMLCanvasElement | undefined>,
  toolState: ToolState
) => {
  const mouseDown = React.useRef(false);

  const handleMouseDown = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      mouseDown.current = true;
      const ctx = canvas.current?.getContext("2d");
      if (!canvas.current || !ctx) return;

      e.preventDefault();

      const pos = "touches" in e ? e.changedTouches[0] : e;

      const rect = canvas.current.getBoundingClientRect();
      ctx.beginPath();
      ctx.arc(
        pos.clientX - rect.left,
        pos.clientY - rect.top,
        { small: 3, large: 10 }[toolState.size] / 2,
        0,
        2 * Math.PI
      );
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(pos.clientX - rect.left, pos.clientY - rect.top);
    },
    [canvas, toolState]
  );

  const handleMouseUp = React.useCallback(() => {
    if (mouseDown.current) {
      mouseDown.current = false;
      const ctx = canvas.current?.getContext("2d");
      ctx?.stroke();
    }
  }, [canvas]);

  React.useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("touchcancel", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchcancel", handleMouseUp);
    };
  }, [handleMouseUp]);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!canvas.current || !mouseDown.current) return;

      const ctx = canvas.current.getContext("2d");
      if (!ctx) return;

      e.preventDefault();

      ctx.lineWidth = { small: 3, large: 10 }[toolState.size];
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = { pencil: "black", eraser: "white" }[toolState.tool];

      const pos = "touches" in e ? e.changedTouches[0] : e;

      const rect = canvas.current.getBoundingClientRect();
      ctx.lineTo(pos.clientX - rect.left, pos.clientY - rect.top);
      ctx?.stroke();
    },
    [canvas, toolState]
  );

  React.useEffect(() => {
    const cv = canvas.current;

    cv?.addEventListener("mousedown", handleMouseDown);
    cv?.addEventListener("mouseout", handleMouseUp);
    cv?.addEventListener("mousemove", handleMouseMove);

    cv?.addEventListener("touchstart", handleMouseDown);
    cv?.addEventListener("touchend", handleMouseUp);
    cv?.addEventListener("touchcancel", handleMouseUp);
    cv?.addEventListener("touchmove", handleMouseMove);

    return () => {
      cv?.removeEventListener("mousedown", handleMouseDown);
      cv?.removeEventListener("mouseout", handleMouseUp);
      cv?.removeEventListener("mousemove", handleMouseMove);

      cv?.removeEventListener("touchstart", handleMouseDown);
      cv?.removeEventListener("touchend", handleMouseUp);
      cv?.removeEventListener("touchcancel", handleMouseUp);
      cv?.removeEventListener("touchmove", handleMouseMove);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp, toolState]);
};

const useTextLayer = (
  canvasParent: React.RefObject<HTMLDivElement>,
  baseCanvas: React.RefObject<HTMLCanvasElement | undefined>
) => {
  const INITIAL_CURSOR_POS = React.useMemo(() => ({ x: 105, y: 22 }), []);
  const TEXT_HORZ_PADDING = 5;

  const cursorPos = React.useRef(INITIAL_CURSOR_POS);
  const text = React.useRef<string[]>([]);

  const textCanvas = usePersistentCanvas(canvasParent, 20, false);

  const TEXT_LINE_HEIGHT = (textCanvas.current?.height || 0) / 5;

  const renderText = React.useCallback(() => {
    const ctx = textCanvas.current?.getContext("2d");
    if (!textCanvas.current || !ctx) return;

    ctx.clearRect(0, 0, textCanvas.current.width, textCanvas.current.height);

    const charPos = Object.assign({}, cursorPos.current);

    for (const char of text.current) {
      if (char === "\n") {
        charPos.x = TEXT_HORZ_PADDING;
        charPos.y += TEXT_LINE_HEIGHT;
      } else {
        ctx.font = ctx.font.replace(/\d+px/, "20px");
        ctx.fillStyle = "black";
        const width = ctx.measureText(char).width;
        if (charPos.x + width > textCanvas.current.width - TEXT_HORZ_PADDING) {
          charPos.x = TEXT_HORZ_PADDING;
          charPos.y += TEXT_LINE_HEIGHT;
        }
        ctx.fillText(char, charPos.x, charPos.y);
        charPos.x += width;
      }
    }
  }, [TEXT_LINE_HEIGHT, textCanvas]);

  const blitDown = React.useCallback(() => {
    const destCtx = baseCanvas.current?.getContext("2d");
    if (!destCtx) return;

    if (!textCanvas.current) return;

    destCtx.drawImage(textCanvas.current, 0, 0);

    const srcCtx = textCanvas.current.getContext("2d");
    if (!srcCtx) return;

    srcCtx.clearRect(0, 0, textCanvas.current.width, textCanvas.current.height);
  }, [baseCanvas, textCanvas]);

  return {
    dispatchText: React.useCallback(
      (char: string) => {
        if (char.length === 1) {
          text.current.push(char);
          renderText();
        } else if (char === "Backspace") {
          text.current.pop();
          renderText();
        }
      },
      [renderText]
    ),
    dispatchTextAction: React.useCallback(
      (action: { type: string; x?: number; y?: number }) => {
        switch (action.type) {
          case "clear":
            text.current = [];
            cursorPos.current = INITIAL_CURSOR_POS;
            renderText();
            break;
          case "new":
            blitDown();
            text.current = [];
            renderText();

            if (action.x === undefined || action.y === undefined) {
              cursorPos.current = INITIAL_CURSOR_POS;
            } else {
              cursorPos.current = { x: action.x, y: action.y };
            }
            break;
        }
      },
      [INITIAL_CURSOR_POS, blitDown, renderText]
    ),
  };
};

const getMessageOffsetHeight = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return [0, 0];

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const zonesUsed = [false, false, false, false, false];

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
          zonesUsed[i] = true;
          break zoneLoop;
        }
      }
    }
  }

  const offset = zonesUsed.indexOf(true);
  const height = zonesUsed.lastIndexOf(true) - offset + 1;

  return [offset, height];
};

export default function MessageCompose({
  toolState,
  dispatch,
  onMessage,
  currentMessage,
  settings,
}: {
  toolState: ToolState;
  dispatch: ComposeEventDispatcher;
  onMessage: (message: MessageData) => void;
  currentMessage: MessageData;
  settings: UserSettings;
}) {
  const canvasParent = React.useRef<HTMLDivElement>(null);
  const canvas = usePersistentCanvas(canvasParent, 10);
  useCanvasMouseEvents(canvas, toolState);
  const { dispatchText, dispatchTextAction } = useTextLayer(
    canvasParent,
    canvas
  );

  React.useEffect(() => {
    dispatch.current = (e: ComposeEvent) => {
      if (!canvas.current) return;
      const ctx = canvas.current.getContext("2d");
      if (!ctx) return;

      switch (e.type) {
        case "clear":
          ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
          dispatchTextAction({ type: "clear" });
          break;
        case "key":
          dispatchText(e.key);
          break;
        case "send": {
          dispatchTextAction({ type: "new" });

          const [offset, height] = getMessageOffsetHeight(canvas.current);

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = canvas.current.width;
          tempCanvas.height = canvas.current.height * (height / 5);

          const tempCtx = tempCanvas.getContext("2d");
          if (!tempCtx) return;

          tempCtx.drawImage(
            canvas.current,
            0,
            -canvas.current.height * (offset / 5)
          );

          const data = tempCanvas.toDataURL("image/png");
          if (data) {
            onMessage({
              type: "user",
              author: settings.name,
              color: settings.color,
              img: data,
              height,
            });
          }

          ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
          break;
        }
        case "copy": {
          ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
          dispatchTextAction({ type: "clear" });

          if (currentMessage.type !== "user") break;

          const image = new Image();
          image.src = currentMessage.img;

          image.onload = () => {
            ctx.drawImage(image, 0, 0);
          };
          break;
        }
        default:
          console.warn("Unknown compose event", e);
      }
    };
  }, [
    canvas,
    dispatch,
    dispatchText,
    dispatchTextAction,
    onMessage,
    currentMessage,
    settings,
  ]);

  return (
    <MessageBlock lines author={settings.name} color={settings.color}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();

          dropAudio.play();

          if (!canvas.current) return;
          const canvasRect = canvas.current.getBoundingClientRect();

          const ctx = canvas.current.getContext("2d");
          const textWidth = ctx?.measureText(
            e.dataTransfer.getData("text")
          ).width;

          dispatchTextAction({
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
