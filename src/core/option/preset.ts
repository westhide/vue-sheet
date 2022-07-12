export const preset = {
  column: {
    align: "center",
    type: "text",
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
    classList: ["border-red-300"],
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
};

export type Preset = typeof preset;
