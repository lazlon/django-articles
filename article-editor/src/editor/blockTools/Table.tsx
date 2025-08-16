import Table from "@editorjs/table"
import { useBlockTool } from "../plugin"
import { JsonNode, toHTML } from "../parser"
import { asString, trim } from "../utils"
import Table2 from "lucide-solid/icons/table-2"

type Data = {
  withHeadings: boolean
  content: Array<Array<string>>
}

useBlockTool<Data>(Table as any, {
  type: "table",
  toolSettings: {
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
      withHeadings: false,
    },
  },
  toolbox: {
    title: "Table",
    icon: asString(Table2),
  },
  renderer: ({ content, withHeadings }) => (
    <table>
      {withHeadings && (
        <thead>
          <tr>
            {content[0].map((text) => (
              <td innerHTML={trim(text)} />
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {content.slice(withHeadings ? 1 : 0).map((row) => (
          <tr>
            {row.map((text) => (
              <td innerHTML={trim(text)} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  parser: (node) => {
    if (node.type == "table") {
      // TODO: actual type safe parsing
      const arr = (n: any) => n as Array<JsonNode>
      const rows = arr(arr(node.content)[0].content)

      // has thead
      if (node.content.length > 1)
        rows.push(...arr(arr(node.content)[1].content))

      return {
        withHeadings: node.content.length > 1,
        content: rows.map((tr) =>
          arr(tr.content).map((td) => toHTML(td.content)),
        ),
      }
    }
  },
})
