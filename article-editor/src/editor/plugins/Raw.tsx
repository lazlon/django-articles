// @ts-expect-error missing types
import RawTool from "@editorjs/raw"
import { Extend } from "../plugin"
import { Icon } from "@/components"

type Data = {
    html: string
}

export default Extend({
    Base: RawTool,
    type: "raw",
    toolbox: {
        title: "HTML",
        icon: Icon("code-xml"),
    },
    render: ({ html }: Data) => html,

    // anything is valid, so we need to return void
    // and make non parseable data fallback to a raw type
    parse: () => void 0,
})
