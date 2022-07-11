import type { VNodeRef } from "vue";
import type { RefValue } from "vue/macros";

type Key = number | string;
type CellValue = unknown;

type RowValue<CV extends CellValue = CellValue> = Record<Key, CV> | CV[];
type Data<T extends RowValue = RowValue> = RefValue<T[]>;
type RowValueKey = keyof RowValue;

type CellRender = unknown;

// TODO: classList use Set
type ClassList = RefValue<string[]>;
type SheetClassList = Record<
  "wrapDiv" | "table" | "tbody" | "thead",
  ClassList
>;

interface Cell {
  map: { row: Key; col: Key };
  align: "center" | "left" | "right";
  type:
    | "autocomplete"
    | "calendar"
    | "checkbox"
    | "color"
    | "dropdown"
    | "hidden"
    | "html"
    | "image"
    | "decimal"
    | "radio"
    | "text";
  mask?: string;
  height: number;
  width: number;
  value: CellValue;
  history: CellValue[];
  render?: CellRender;
  classList: ClassList;
}

interface Column
  extends Pick<
    Cell,
    "align" | "type" | "mask" | "width" | "render" | "classList"
  > {
  key: RowValueKey;
  title: Key;
}

interface Row {
  classList: ClassList;
}

export interface Options<T extends RowValue = RowValue> {
  teleport?: { to: string | HTMLElement; disabled?: boolean };
  data: Data<T>;
  columns: Column[];
  rows: Row[];
  size?: { row: number; col: number };
  fullscreen?: boolean;
  classList?: SheetClassList;
  filter?: (row: T, col: Column) => boolean;
}

class Base<T extends RowValue = RowValue> {
  presetOptions = {
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

  el: VNodeRef;
  options: Required<Options<T>>;

  _fixOptions(options: Options<T>): Required<Options<T>> {
    const dataLen = options.data.length;

    // generate defaultOptions
    const sheetClassList = $ref(this.presetOptions.classList);
    const defaultOptions: Partial<Options> = {
      classList: sheetClassList,
      fullscreen: this.presetOptions.fullscreen,
      size: {
        row: dataLen ?? 0,
        col: options.columns.length,
      },
    };

    // set options.column
    if (!options.columns.length && dataLen) {
      options.columns = Object.keys(options.data[0]).map((key) => {
        const columnClassList = $ref([...this.presetOptions.column.classList]);
        return <Column>{
          ...this.presetOptions.column,
          classList: columnClassList,
          key,
          title: key,
        };
      });
    }

    // set options.rows
    if (!options.rows.length && dataLen) {
      options.rows = options.data.map(() => {
        const rowClassList = $ref([...this.presetOptions.row.classList]);
        return {
          classList: rowClassList,
        };
      });
    }

    options = { ...defaultOptions, ...options };

    // options.classList = <TableClassList>{
    //   ...defaultOptions.classList,
    //   ...options.classList,
    // };

    return <Required<Options<T>>>options;
  }

  constructor(options: Options<T>) {
    this.el = ref();
    this.options = this._fixOptions(options);
  }

  fullscreen(activate = !this.options.fullscreen) {
    if (this.options.fullscreen !== activate) {
      this.options.fullscreen = activate;

      if (activate) {
        this.options.classList.table.push("fullscreen");
      } else {
        arrayPull(this.options.classList.table, "fullscreen");
      }
    }
  }

  _prepare() {
    //
  }

  init() {
    this._prepare();
  }
}

export default Base;
