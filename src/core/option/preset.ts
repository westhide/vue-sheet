import type { Column } from "../worksheet/base";

export type Preset = typeof preset;
export const preset = {
  column: {
    align: <Column["align"]>"center",
    type: <Column["type"]>"text",
    width: 50,
    classList: [
      // size
      // background
      "bg-[#f3f3f3]",
      // border
      "border",
      "border-[0.5px]",
      "border-inherit",
      // text
      "text-center",
      "align-middle",
      // cursor
      "hover:cursor-grab",
      // transition
      // "transition-all",
      // "ease-in-out",
      "duration-300",
      // space
      "px-2",
      "w-24",
    ],
  },
  row: {
    classList: [
      "bg-inherit",
      // transition
      "duration-300",
    ],
    label: {
      classList: [
        // size
        "w-10",
        // background
        "bg-[#f3f3f3]",
        // border
        "border",
        "border-[0.5px]",
        "border-inherit",
        // text
        "text-center",
        "align-middle",
        // cursor
        "hover:cursor-pointer",
        // space
        "px-2",
      ],
    },
  },
  cell: {
    classList: [
      // size
      "w-24",
      // background
      // "bg-[#f3f3f3]",
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
      // cursor
      "hover:cursor-cell",
      // transition
      "duration-300",
      // space
      "px-2",
    ],
  },
  sheetClassList: {
    wrapDiv: [
      // display
      "inline-block",
      // size
      "w-auto",
      "max-w-full",
      "max-h-96",
      // scroll
      "overflow-auto",
      // effects
      // "shadow-xl",
    ],
    corner: ["bg-[#f3f3f3]"],
    table: [
      // layout
      // "relative",
      // size
      "min-w-max",
      // border
      "border",
      "border-separate",
      "border-spacing-0",
      "border-inherit",
      // transition
      "duration-300",
    ],
    thead: ["thead"],
    theadRow: ["thead-row"],
    tbody: ["tbody"],
  },
  fullscreen: false,
  nanoid: { size: 10 },
};
