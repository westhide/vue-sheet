import { Teleport } from "vue";
import Worksheet from "../core/worksheet";

interface Props {
  worksheet: Worksheet;
}

export default {
  props: {
    worksheet: Worksheet,
  },
  setup(props: Props) {
    const worksheet = props.worksheet;
    const { el, options } = worksheet;
    const { teleport, sheetClassList, table, filter } = options;
    const tableColumns = $computed(() =>
      reduceFilter(table.columns, filter.col)
    );
    const tableRows = $computed(() => reduceFilter(table.rows, filter.row));

    return () => {
      const tableTsx = (
        <div class={sheetClassList.wrapDiv}>
          <table ref={el} class={sheetClassList.table}>
            <thead class={sheetClassList.thead}>
              <tr class={sheetClassList.theadRow}>
                {/* * Corner */}
                <th class={sheetClassList.corner}></th>
                {tableColumns.map((col) => (
                  // * Column
                  <th class={col.classList}>{col.title}</th>
                ))}
              </tr>
            </thead>

            <tbody class={sheetClassList.tbody}>
              {/*TODO: virtual scroll*/}
              {tableRows.map(
                ({ row, classList: rowClassList, label }, index) => {
                  return (
                    <tr class={rowClassList}>
                      {/* * Row label */}
                      <td class={label.classList}>
                        {label.value ?? index + 1}
                      </td>
                      {tableColumns.map((col) => (
                        //  * Cell
                        <td class={row[col.key].classList}>
                          {row[col.key].value}
                        </td>
                      ))}
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      );

      return teleport ? (
        <Teleport {...teleport}>{tableTsx}</Teleport>
      ) : (
        tableTsx
      );
    };
  },
};
