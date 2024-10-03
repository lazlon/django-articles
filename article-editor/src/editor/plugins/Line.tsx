import { Icon } from "@/components"
import { BlockPlugin } from "../plugin"

export default BlockPlugin({
    // eslint-disable-next-line no-empty-pattern
    Block: ({ }) => <hr />,
    type: "line",
    title: "Line",
    icon: Icon("minus"),
    render: () => <hr />,
    parse: node => {
        if (node.type == "hr")
            return {}
    },
    save: () => ({}),
})
