import type { VNodeRef } from "vue";
import type { RefValue } from "vue/macros";
import type { Preset } from "../option/preset";
import { preset as _preset } from "../option/preset";

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
  el: VNodeRef;
  options: Required<Options<T>>;

  _fixOptions(options: Options<T>, preset: Preset): Required<Options<T>> {
    const dataLen = options.data.length;

    // generate defaultOptions
    const sheetClassList = $ref(preset.classList);
    const defaultOptions: Partial<Options> = {
      classList: sheetClassList,
      fullscreen: preset.fullscreen,
      size: {
        row: dataLen ?? 0,
        col: options.columns.length,
      },
    };

    // set options.column
    if (!options.columns.length && dataLen) {
      options.columns = Object.keys(options.data[0]).map((key) => {
        const columnClassList = $ref([...preset.column.classList]);
        return <Column>{
          ...preset.column,
          classList: columnClassList,
          key,
          title: key,
        };
      });
    }

    // set options.rows
    if (!options.rows.length && dataLen) {
      options.rows = options.data.map(() => {
        const rowClassList = $ref([...preset.row.classList]);
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

  constructor(options: Options<T>, preset: Preset = _preset) {
    this.el = ref();
    this.options = this._fixOptions(options, preset);
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
