import type { Ref } from "vue";
import type { RefValue } from "vue/macros";

type Key = number | string;
type CellValue = unknown;
type CellRender = unknown;
type TableClassList = Record<"table" | "tbody" | "thead", RefValue<string>[]>;

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
  classList: RefValue<string>[];
}

interface Column
  extends Pick<
    Cell,
    "align" | "type" | "mask" | "width" | "render" | "classList"
  > {
  key: Key;
  title: Key;
}

interface Options {
  teleport?: { to: string | HTMLElement; disabled?: boolean };
  data: Record<string | number, CellValue>[];
  columns: Column[];
  size?: { row: number; col: number };
  fullscreen?: boolean;
  classList?: TableClassList;
}

const tableClassList = $ref([
  "border",
  "border-separate",
  "border-slate-500",
  "w-auto",
]);
const tbodyClassList = $ref([""]);
const theadClassList = $ref([""]);
const defaultOptions: Partial<Options> = {
  classList: {
    table: tableClassList,
    tbody: tbodyClassList,
    thead: theadClassList,
  },
  fullscreen: false,
};

const columnClassList = $ref(["border", "hover:border-green-500"]);
const defaultColumn: Partial<Column> = {
  align: "center",
  type: "text",
  width: 10,
  classList: columnClassList,
};

class Base {
  el: Ref<Element | undefined>;
  options: Required<Options>;

  _fixOptions(options: Options): Required<Options> {
    if (!options.columns.length && options.data.length) {
      options.columns = Object.keys(options.data[0]).map(
        (key) =>
          <Column>{
            ...defaultColumn,
            key,
            title: key,
          }
      );
    }

    options = { ...defaultOptions, ...options };
    options.size = options.size ?? {
      row: options.data.length ?? 0,
      col: options.columns.length,
    };
    options.classList = <TableClassList>{
      ...defaultOptions.classList,
      ...options.classList,
    };

    return <Required<Options>>options;
  }

  constructor(options: Options) {
    this.el = ref<Element>();
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
