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
    const options = props.worksheet.options;
    const data = options.data.slice(0, 100);

    function filter<T>(
      target: T[],
      fn?: (value: T, index: number, array: T[]) => boolean
    ) {
      return fn ? target.filter(fn) : target;
    }

    return () => {
      const columns = filter(options.columns, options.filter.col);
      const rows = filter(data, options.filter.row);

      const tableTsx = (
        <div class={joinClass(options.classList.wrapDiv)}>
          <table
            ref={props.worksheet.el}
            class={joinClass(options.classList.table)}
          >
            <thead class={joinClass(options.classList.thead)}>
              <tr>
                {/*TODO: rowLabel & thead corner*/}
                <tr></tr>
                {columns.map((col) => (
                  <th class={joinClass(col.classList)}>{col.title}</th>
                ))}
              </tr>
            </thead>
            <tbody class={joinClass(options.classList.tbody)}>
              {/*TODO: virtual scroll*/}
              {rows.map((row, index) => {
                return (
                  <tr class={joinClass(options.rows[row.id].classList)}>
                    <td class={joinClass(options.rowLabels[row.id].classList)}>
                      {index + 1}
                    </td>
                    {columns.map((col) => (
                      <td class={joinClass(col.classList)}>{row[col.key]}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );

      const teleport = options.teleport;
      return teleport ? (
        <Teleport {...teleport}>{tableTsx}</Teleport>
      ) : (
        tableTsx
      );
    };
  },
};
