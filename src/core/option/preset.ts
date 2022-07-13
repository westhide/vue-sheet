import type { Column } from "../worksheet/base";

export type Preset = typeof preset;
export const preset = {
  column: {
    align: <Column["align"]>"center",
    type: <Column["type"]>"text",
    width: 50,
    classList: [
      // size
      "w-24",
      // background
      "bg-[#f3f3f3]",
      // border
      "border",
      "border-[0.5px]",
      "border-inherit",
      "hover:outline",
      "hover:outline-[0.5px]",
      "hover:outline-black",
      "hover:border-black",
      // text
      "text-center",
      "align-middle",
      // transition
      "transition-all",
      "ease-in-out",
      "duration-300",
    ],
  },
  row: {
    classList: [""],
  },
  rowLabel: {
    classList: [
      // size
      "w-auto",
      // background
      "bg-[#f3f3f3]",
      // border
      "border",
      "border-[0.5px]",
      "border-inherit",
      // text
      "text-center",
      "align-middle",
      // space
      "px-2",
    ],
  },
  classList: {
    wrapDiv: [
      // display
      "inline-block",
      // size
      "h-80",
      "w-auto",
      // scroll
      "overflow-auto",
    ],
    table: [
      // border
      "border",
      "border-separate",
      "border-spacing-0",
      "border-inherit",
      // cursor
      "hover:cursor-cell",
      // transition
      "transition-all",
      "ease-in-out",
      "duration-300",
    ],
    thead: [""],
    theadRow: [""],
    tbody: [""],
  },
  fullscreen: false,
  filter: {},
};
