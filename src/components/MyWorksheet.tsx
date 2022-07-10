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
        <table
          ref={props.worksheet.el}
          class={options.classList.table.join(" ")}
        >
          <thead class={options.classList.thead.join(" ")}>
            <tr>
              {options.columns.map((col) => (
                <th class={col.classList.join(" ")}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody class={options.classList.tbody.join(" ")}>
            {/*TODO: virtual scroll*/}
            {options.data.slice(0, 100).map((row) => (
              <tr>
                {options.columns.map((col) => (
                  <td class={col.classList.join(" ")}>{row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
