import Header from "@editorjs/header"
import { toHTML } from "../parser"
import { Extend } from "../plugin"
import { Icon } from "@/components"

const config = {
    levels: [2, 3, 4] as const,
    defaultLevel: 2,
}

type Data = {
    level: typeof config["levels"][number]
    text: string
}

export default Extend({
    Base: Header as any,
    type: "header",
    toolbox: {
        title: "Heading",
        icon: Icon("heading"),
    },
    config: {
        shortcut: "CMD+SHIFT+H",
        inlineToolbar: true,
        config,
    },
    render: ({ level, text }: Data, { trim }) => {
        switch (level) {
            case 2: return <h2 innerHTML={trim(text)} />
            case 3: return <h3 innerHTML={trim(text)} />
            case 4: return <h4 innerHTML={trim(text)} />
        }
    },
    parse: node => {
        // silly TS won't infer node as ElementNode with
        // ["h2", "h3", "h4"].includes(node.type)
        if (node.type === "h2" || node.type === "h3" || node.type === "h4") {
            return {
                level: Number(node.type[1]) as Data["level"],
                text: node.content.map(toHTML).join(""),
            }
        }
    },
})
