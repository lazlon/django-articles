// @ts-expect-error missing types
import ParagraphTool from "@editorjs/paragraph"
import { Extend } from "../plugin"
import { toHTML } from "../parser"
import { Icon } from "@/components"
import { Type } from "lucide"

type Data = {
    text: string
}

export default Extend({
    Base: ParagraphTool,
    type: "paragraph",
    config: {
        inlineToolbar: true,
    },
    render: ({ text }: Data, { trim }) => (
        <p innerHTML={trim(text)} />
    ),
    toolbox: {
        title: "Text",
        icon: Icon(Type),
    },
    parse(node): Data | void {
        switch (node.type) {
            case "#text": return {
                text: node.content,
            }
            case "p": return {
                text: node.content.map(toHTML).join(""),
            }
        }
    },
})
