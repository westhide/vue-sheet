import type { VNodeRef, ComputedRef } from "vue";
import type { RefValue } from "vue/macros";
import type { Preset } from "../option/preset";
import { preset as _preset } from "../option/preset";

type Key = number | string | symbol;
type CellValue = unknown;

type RowValue<CV extends CellValue = CellValue> = Record<Key, CV> &
  Partial<Record<"id", Key>>;
type Data<T extends RowValue> = RefValue<T[]>;

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
  rows?: Record<Key, Row>;
  rowLabels?: Record<Key, RowLabel>;
  size?: { row: number; col: number };
  fullscreen?: boolean;
  classList?: SheetClassList;
  filter: {
    row?: Array<(row: T, index: number, array: T[]) => boolean>;
    col?: Array<(col: Column<T>, index: number, array: Column<T>[]) => boolean>;
    cell?: Array<(row: T, col: Column<T>) => boolean>;
  };
}

export default class Base<T extends RowValue = RowValue> {
  el: VNodeRef;
  options: Required<Options<T>>;
  tableData: ComputedRef<Record<Key, T>>;
  tableColumns: ComputedRef<Column<T>[]>;

  fixOptions(options: Options<T>, preset: Preset): Required<Options<T>> {
    const dataLen = options.data.length;
    const tableDataKeys = objectKeys(this.tableData.value);

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
        const rowEntries = tableDataKeys.map((key) => {
          const rowClassList = $ref([...preset.row.classList]);
          return [
            key,
            {
              classList: rowClassList,
            },
          ];
        });
        options.rows = Object.fromEntries(rowEntries);
      }

      // set options.rowLabels
      if (!options.rowLabels) {
        const rowLabelEntries = tableDataKeys.map((key) => {
          const rowLabelClassList = $ref([...preset.rowLabel.classList]);
          return [
            key,
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
    this.tableData = computed(() => {
      const { data, filter } = options;
      const filterData = reduceFilter(data, filter.row);
      return Object.fromEntries(
        filterData.map((row, index) => [row.id ?? index, row])
      );
    });
    this.options = this.fixOptions(options, preset);
    this.tableColumns = computed(() =>
      reduceFilter(this.options.columns, this.options.filter.col)
    );
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

  init() {
    //
  }
}
