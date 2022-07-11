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
    return () => {
      const tableTsx = (
        <div class={joinClass(options.classList.wrapDiv)}>
          <table
            ref={props.worksheet.el}
            class={joinClass(options.classList.table)}
          >
            <thead class={joinClass(options.classList.thead)}>
              <tr>
                {options.columns.map((col) => (
                  <th class={joinClass(col.classList)}>{col.title}</th>
                ))}
              </tr>
            </thead>
            <tbody class={joinClass(options.classList.tbody)}>
              {/*TODO: virtual scroll*/}
              {options.data.slice(0, 100).map((row, index) => (
                <tr class={joinClass(options.rows[index].classList)}>
                  {(options.filter
                    ? options.columns.filter((col) => options.filter(row, col))
                    : options.columns
                  ).map((col) => (
                    <td class={joinClass(col.classList)}>{row[col.key]}</td>
                  ))}
                </tr>
              ))}
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
