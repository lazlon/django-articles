import Table from "@editorjs/table"
import { JsonNode, toHTML } from "../parser"
import { Extend } from "../plugin"
import { Icon } from "@/components"

type Data = {
    withHeadings: boolean
    content: Array<Array<string>>
}

export default Extend({
    Base: Table as any,
    config: {
        inlineToolbar: true,
        config: {
            rows: 2,
            cols: 3,
            withHeadings: false,
        },
    },
    type: "table",
    toolbox: {
        title: "Table",
        icon: Icon("table"),
    },
    render: ({ content, withHeadings }: Data, { trim }) => (
        <table>
            {withHeadings && <thead>
                <tr>
                    {content[0].map(text => (
                        <td innerHTML={trim(text)} />
                    ))}
                </tr>
            </thead>}
            <tbody>
                {content.slice(withHeadings ? 1 : 0).map(row => (
                    <tr>
                        {row.map(text => (
                            <td innerHTML={trim(text)} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    ),
    parse: node => {
        if (node.type == "table") {
            // FIXME: find a way for typesafe parsing
            const arr = (n: any) => n as Array<JsonNode>
            const rows = arr(arr(node.content)[0].content)

            // has thead
            if (node.content.length > 1)
                rows.push(...arr(arr(node.content)[1].content))

            return {
                withHeadings: node.content.length > 1,
                content: rows.map(tr => arr(tr.content).map(td =>
                    arr(td.content).map(toHTML).join(""),
                )),
            }
        }
    },
})
