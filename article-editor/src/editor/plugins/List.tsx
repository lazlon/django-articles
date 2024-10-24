import List from "@editorjs/list"
import { JsonNode, toHTML } from "../parser"
import { Extend } from "../plugin"

type Data = {
    style: "unordered" | "ordered"
    items: string[]
}

export default Extend({
    Base: List as any,
    type: "list",
    config: {
        inlineToolbar: true,
        config: {
            defaultStyle: "unordered",
        },
    },
    render: ({ style, items }: Data, { trim }) => {
        const List = style == "ordered" ? "ol" : "ul"
        return <List>{items.map(i => <li innerHTML={trim(i)} />)}</List>
    },
    parse: (node: JsonNode) => {
        if (node.type === "ol" || node.type === "ul") {
            return {
                style: node.type === "ul" ? "unordered" : "ordered",
                items: node.content.map(node => typeof node.content === "string"
                    ? toHTML(node) : node.content.map(toHTML),
                ),
            }
        }
    },
})
