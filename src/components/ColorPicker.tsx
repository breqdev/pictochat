import React from "react";

export const COLORS = [
  "#868f9e",
  "#965454",
  "#ff0000",
  "#ff8aeb",
  "#ffa200",
  "#f0ec00",
  "#bdff59",
  "#00ff00",
  "#05a100",
  "#00e6a1",
  "#00d0ff",
  "#0000ff",
  "#00009e",
  "#6900d1",
  "#a502e0",
  "#de0081",
] as const;

export type Color = typeof COLORS[number];

export const PALETTES = {
  "#868f9e": {
    fg: "#3d4147",
    bg: "#b2bdd1",
  },
  "#965454": {
    fg: "#5e3232",
    bg: "#d68b8b",
  },
  "#ff0000": {
    fg: "#bd0000",
    bg: "#ff8c8c",
  },
  "#ff8aeb": {
    fg: "#d420b6",
    bg: "#ff8aeb",
  },
  "#ffa200": {
    fg: "#d18500",
    bg: "#ffcd75",
  },
  "#f0ec00": {
    fg: "#949200",
    bg: "#fffd82",
  },
  "#bdff59": {
    fg: "#84b33d",
    bg: "#bdff59",
  },
  "#00ff00": {
    fg: "#009e00",
    bg: "#9cff9c",
  },
  "#05a100": {
    fg: "#05a100",
    bg: "#71fc6d",
  },
  "#00e6a1": {
    fg: "#00b57f",
    bg: "#80ffd9",
  },
  "#00d0ff": {
    fg: "#00afd6",
    bg: "#9eedff",
  },
  "#0000ff": {
    fg: "#0000ff",
    bg: "#9999ff",
  },
  "#00009e": {
    fg: "#00009e",
    bg: "#7878ad",
  },
  "#6900d1": {
    fg: "#6900d1",
    bg: "#c49ded",
  },
  "#a502e0": {
    fg: "#a502e0",
    bg: "#cc99de",
  },
  "#de0081": {
    fg: "#a3005f",
    bg: "#eb7cbd",
  },
};

export default function ColorPicker({
  color,
  setColor,
}: {
  color: string;
  setColor: (c: Color) => void;
}) {
  return (
    <div className="grid grid-cols-4 self-center gap-3 border-gray-300 border-4 px-4 py-1.5">
      {COLORS.map((c) => (
        <button
          style={{ borderColor: color === c ? c : "#ffffff" }}
          className="border-dashed border-2 p-1.5"
          onClick={() => setColor(c)}
          key={c}
        >
          <div
            style={{ backgroundColor: c }}
            className="w-6 h-6 border-dashed border-1"
          />
        </button>
      ))}
    </div>
  );
}
