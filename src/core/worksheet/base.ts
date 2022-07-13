import type { VNodeRef } from "vue";
import type { RefValue } from "vue/macros";
import type { Preset } from "../option/preset";
import { preset as _preset } from "../option/preset";

type Key = number | string | symbol;
type CellValue = unknown;

type RowValue<CV extends CellValue = CellValue> = Record<Key, CV> &
  Record<"id", Key>;
type Data<T extends RowValue = RowValue> = RefValue<T[]>;

type CellRender = unknown;

// TODO: classList switch to DOMTokenList
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

export interface Column<T extends RowValue = RowValue>
  extends Pick<
    Cell,
    "align" | "type" | "mask" | "width" | "render" | "classList"
  > {
  key: keyof T;
  title: Key;
}

interface Row {
  classList: ClassList;
}

interface RowLabel {
  classList: ClassList;
}

export interface Options<T extends RowValue> {
  teleport?: { to: string | HTMLElement; disabled?: boolean };
  data: Data<T>;
  columns: Column<T>[];
  rows?: Record<T["id"], Row>;
  rowLabels?: Record<T["id"], RowLabel>;
  size?: { row: number; col: number };
  fullscreen?: boolean;
  classList?: SheetClassList;
  filter: {
    row?: (row: T, index: number, array: T[]) => boolean;
    col?: (col: Column<T>, index: number, array: Column<T>[]) => boolean;
    cell?: (row: T, col: Column<T>) => boolean;
  };
}

export default class Base<T extends RowValue = RowValue> {
  el: VNodeRef;
  options: Required<Options<T>>;

  static _fixOptions<T extends RowValue = RowValue>(
    options: Options<T>,
    preset: Preset
  ): Required<Options<T>> {
    const dataLen = options.data.length;

    // generate defaultOptions
    const sheetClassList = $ref(preset.classList);
    const defaultOptions: Partial<Options<T>> = {
      classList: sheetClassList,
      fullscreen: preset.fullscreen,
      size: {
        row: dataLen ?? 0,
        col: options.columns.length,
      },
    };

    if (dataLen) {
      // set options.column
      if (!options.columns.length) {
        options.columns = objectKeys(options.data[0]).map((key) => {
          // * use spread avoid ref the same classList
          const columnClassList = $ref([...preset.column.classList]);
          return {
            ...preset.column,
            classList: columnClassList,
            key,
            title: key,
          };
        });
      }

      // set options.rows
      if (isEmpty(options.rows)) {
        const rowEntries = options.data.map((row) => {
          const rowClassList = $ref([...preset.row.classList]);
          return [
            row.id,
            {
              classList: rowClassList,
            },
          ];
        });
        options.rows = Object.fromEntries(rowEntries);
      }

      // set options.rowLabels
      if (!options.rowLabels) {
        const rowLabelEntries = options.data.map((row) => {
          const rowLabelClassList = $ref([...preset.rowLabel.classList]);
          return [
            row.id,
            {
              classList: rowLabelClassList,
            },
          ];
        });
        options.rowLabels = Object.fromEntries(rowLabelEntries);
      }
    }

    options = { ...defaultOptions, ...options };

    return <Required<Options<T>>>options;
  }

  // * use cloneDeep avoid shallow copy
  constructor(options: Options<T>, preset: Preset = cloneDeep(_preset)) {
    this.el = ref();
    this.options = Base._fixOptions(options, preset);
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
