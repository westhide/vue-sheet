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
    const { el, options, tableData, tableColumns } = worksheet;
    const { teleport, classList: sheetClassList } = options;

    return () => {
      const tableTsx = (
        <div class={joinClass(sheetClassList.wrapDiv)}>
          <table ref={el} class={joinClass(sheetClassList.table)}>
            <thead class={joinClass(sheetClassList.thead)}>
              <tr>
                {/*TODO: rowLabel & thead corner*/}
                <tr></tr>
                {tableColumns.value.map((col) => (
                  <th class={joinClass(col.classList)}>{col.title}</th>
                ))}
              </tr>
            </thead>
            <tbody class={joinClass(sheetClassList.tbody)}>
              {/*TODO: virtual scroll*/}
              {Object.entries(tableData.value).map(([key, row], index) => {
                return (
                  <tr class={joinClass(options.rows[key].classList)}>
                    <td class={joinClass(options.rowLabels[key].classList)}>
                      {index + 1}
                    </td>
                    {tableColumns.value.map((col) => (
                      <td class={joinClass(col.classList)}>{row[col.key]}</td>
                    ))}
                  </tr>
                );
              })}
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
