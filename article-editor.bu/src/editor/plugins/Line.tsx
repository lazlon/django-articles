import "./Line.css"
import { Block } from "@/components"
import { Icon } from "@/components"
import { BlockPlugin } from "../plugin"
import { Minus } from "lucide"

export default BlockPlugin({
    // eslint-disable-next-line no-empty-pattern
    Block: ({ }) => <Block className="line">
        <hr />
    </Block>,
    type: "line",
    title: "Line",
    icon: Icon(Minus),
    render: () => <hr />,
    parse: node => {
        if (node.type == "hr")
            return {}
    },
    save: () => ({}),
})
