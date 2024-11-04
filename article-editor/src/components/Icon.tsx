import "./Icon.css"
import { type IconNode, createElement } from "lucide"

type IconProps = Omit<JSX.IntrinsicElements["div"], "innerHTML"> & {
    icon: IconNode
    stroke?: number
    color?: string
}

function isNode(node: any): node is IconNode {
    return Array.isArray(node)
}

export default function Icon(icon: IconNode): string
export default function Icon(props: IconProps): JSX.Element

export default function Icon(arg: IconNode | IconProps) {
    const element = createElement(isNode(arg) ? arg : arg.icon)

    if (isNode(arg))
        return element.outerHTML

    const { icon, stroke = 2, color, ...props } = arg
    element.setAttribute("stroke-width", String(stroke))

    if (color) {
        element.setAttribute("stroke", color)
    }

    return <div
        className={`Icon ${icon}`}
        innerHTML={element.outerHTML}
        {...props}
    />
}
