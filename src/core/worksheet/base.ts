import type { VNodeRef, UnwrapNestedRefs } from "vue";
import type { Preset } from "../option/preset";
import { preset as _preset } from "../option/preset";

type Key = number | string | symbol;
type CellValue = unknown;

type RowValue<V extends CellValue = CellValue> = Record<Key, V> &
  Partial<Record<"__id__", Key>>;

type CellRender = unknown;

// TODO: classList switch to DOMTokenList
type ClassList = string[];
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

interface Row<T extends RowValue> {
  id: Key;
  rawIndex: number;
  row: T;
  classList: ClassList;
  label: {
    classList: ClassList;
  };
}

export interface Options<T extends RowValue> {
  teleport?: { to: string | HTMLElement; disabled?: boolean };
  data: T[];
  table: {
    columns: Column<T>[];
    rows: Row<T>[];
  };
  size: { row: number; col: number };
  fullscreen: boolean;
  sheetClassList: SheetClassList;
  filter: {
    row: Array<(row: Row<T>, index: number, array: Row<T>[]) => boolean>;
    col: Array<(col: Column<T>, index: number, array: Column<T>[]) => boolean>;
    cell: Array<(row: T, col: Column<T>) => boolean>;
  };
  nanoid?: { size: number };
}

interface InitOptions<T extends RowValue>
  extends Pick<Options<T>, "teleport" | "data">,
    Partial<
      Pick<Options<T>, "size" | "fullscreen" | "sheetClassList" | "nanoid">
    > {
  table?: Partial<Options<T>["table"]>;
  filter?: Partial<Options<T>["filter"]>;
}

export default class Base<T extends RowValue = RowValue> {
  el: VNodeRef;
  options: UnwrapNestedRefs<Options<T>>;

  fixOptions(options: InitOptions<T>, preset: Preset) {
    const table = options.table ?? {};
    const nanoidSize = options.nanoid?.size ?? preset.nanoid.size;

    // set table.rows
    if (!table.rows) {
      table.rows = options.data.map(
        (row, index) =>
          <Row<T>>{
            id: nanoid(nanoidSize),
            rawIndex: index,
            row,
            classList: [...preset.row.classList],
            label: {
              classList: [...preset.row.label.classList],
            },
          }
      );
    }

    // set options.column
    if (!table.columns) {
      table.columns = objectKeys(options.data[0]).map((key) => {
        // * use spread avoid ref the same classList
        return {
          ...preset.column,
          classList: [...preset.column.classList],
          key,
          title: key,
        };
      });
    }

    options = {
      table,
      size: {
        row: options.data.length,
        col: table.columns.length,
      },
      fullscreen: preset.fullscreen,
      sheetClassList: preset.sheetClassList,
      ...options,
    };

    return reactive(<Options<T>>options);
  }

  // * use cloneDeep avoid shallow copy
  constructor(options: InitOptions<T>, preset: Preset = cloneDeep(_preset)) {
    this.el = ref();
    this.options = this.fixOptions(options, preset);
  }

  fullscreen(activate = !this.options.fullscreen) {
    if (this.options.fullscreen !== activate) {
      this.options.fullscreen = activate;

      if (activate) {
        this.options.sheetClassList.table.push("fullscreen");
      } else {
        arrayPull(this.options.sheetClassList.table, "fullscreen");
      }
    }
  }

  init() {
    //
  }
}
