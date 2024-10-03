import "./Icon.css"
import * as lucide from "lucide"

const icons = {
    "circle-alert": lucide.CircleAlert,
    "frame": lucide.Frame,
    "type": lucide.Type,
    "code-xml": lucide.CodeXml,
    "paperclip": lucide.Paperclip,
    "images": lucide.Images,
    "chevron-left": lucide.ChevronLeft,
    "chevron-right": lucide.ChevronRight,
    "x": lucide.X,
    "search": lucide.Search,
    "loader": lucide.LoaderCircle,
    "heading": lucide.Heading,
    "paint-roller": lucide.PaintRoller,
    "upload": lucide.Upload,
    "image": lucide.Image,
    "minus": lucide.Minus,
    "external-link": lucide.ExternalLink,
    "table": lucide.Table2,
    "list": lucide.List,
    "megaphone": lucide.Megaphone,
    "tag": lucide.Tag,
    "calendar": lucide.Calendar,
    "clock": lucide.Clock,
    "alert": lucide.TriangleAlert,
    "save": lucide.Save,
    "plus": lucide.PlusCircle,
}

type IconProps = Omit<JSX.IntrinsicElements["div"], "innerHTML"> & {
    icon: keyof typeof icons
    stroke?: number
    color?: string
}

export default function Icon(icon: keyof typeof icons): string
export default function Icon(props: IconProps): JSX.Element

export default function Icon(arg: keyof typeof icons | IconProps) {
    const element = lucide.createElement(typeof arg === "string"
        ? icons[arg]
        : icons[arg.icon])

    if (typeof arg === "string")
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
