import type { VNodeRef, UnwrapNestedRefs } from "vue";
import { type Preset, preset as _preset } from "../option/preset";

type Key = number | string | symbol;
type CellValue = unknown;

// * when PK assign,set RowValue[PK] type to Key
export type PrimaryKey<T> = keyof T | undefined;
export type RowValue<
  PK extends Key | undefined = undefined,
  V extends CellValue = CellValue
> = Record<Key, V> & Record<Exclude<PK, undefined>, Key>;

type CellRender = unknown;

// TODO: classList switch to DOMTokenList
type ClassList = string[];
type SheetClassList = Record<
  "wrapDiv" | "corner" | "table" | "thead" | "theadRow" | "tbody",
  ClassList
>;

interface Cell<T extends RowValue> {
  map: { row: Key; col: keyof T };
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
    Cell<T>,
    "align" | "type" | "mask" | "width" | "render" | "classList"
  > {
  key: keyof T;
  title: Key;
}

interface Row<T extends RowValue> {
  id: Key;
  row: Record<keyof T, Cell<T>>;
  classList: ClassList;
  label: {
    value?: CellValue;
    classList: ClassList;
  };
}

export interface Options<PK extends PrimaryKey<T>, T extends RowValue<PK>> {
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
  primaryKey?: PK;
  nanoid: { size: number };
}

interface InitOptions<PK extends PrimaryKey<T>, T extends RowValue<PK>>
  extends Pick<Options<PK, T>, "teleport" | "data" | "primaryKey">,
    Partial<
      Pick<Options<PK, T>, "size" | "fullscreen" | "sheetClassList" | "nanoid">
    > {
  table?: Partial<Options<PK, T>["table"]>;
  filter?: Partial<Options<PK, T>["filter"]>;
}

export default class Base<
  PK extends PrimaryKey<T> = undefined,
  T extends RowValue<PK> = RowValue<PK>
> {
  el: VNodeRef;

  options: UnwrapNestedRefs<Options<PK, T>>;

  fixOptions(options: InitOptions<PK, T>, preset: Preset) {
    const { table = {}, primaryKey } = options;
    const { size: nanoidSize } = options.nanoid ?? preset.nanoid;

    // set table.rows
    if (!table.rows) {
      table.rows = options.data.map((row) => {
        const rowEntries = Object.entries(row).map(
          ([key, value]) =>
            <[keyof T, Cell<T>]>[
              key,
              { value, classList: [...preset.cell.classList] },
            ]
        );
        return <Row<T>>{
          id: primaryKey ? row[primaryKey!] : nanoid(nanoidSize),
          row: Object.fromEntries(rowEntries),
          classList: [...preset.row.classList],
          label: {
            classList: [...preset.row.label.classList],
          },
        };
      });
    }

    // set options.column
    if (!table.columns) {
      const [firstRow] = options.data;
      table.columns = objectKeys(firstRow ?? {}).map((key) => {
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
      nanoid: preset.nanoid,
      ...options,
    };

    return reactive(<Options<PK, T>>options);
  }

  // * use cloneDeep avoid shallow copy
  constructor(
    options: InitOptions<PK, T>,
    preset: Preset = cloneDeep(_preset)
  ) {
    this.el = ref();
    this.options = this.fixOptions(options, preset);
  }

  // TODO: fullscreen
  fullscreen(activate = !this.options.fullscreen) {
    const { fullscreen, sheetClassList } = this.options;
    if (fullscreen !== activate) {
      this.options.fullscreen = activate;

      if (activate) {
        sheetClassList.table.push("fullscreen");
      } else {
        arrayPull(sheetClassList.table, "fullscreen");
      }
    }
  }

  init() {
    //
  }
}
