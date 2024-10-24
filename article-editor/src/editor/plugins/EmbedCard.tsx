import "./EmbedCard.css"
import { Block, Icon, Input } from "@/components"
import { JsonNode, toHTML } from "../parser"
import { BlockPlugin } from "../plugin"

type Data = {
    src: string
    caption?: string
}

export default BlockPlugin({
    Block: ({ src, caption }: Data) => (
        <Block className="embed-card">
            <iframe src={src} style={{ border: "none" }} />
            <div className="body">
                <Input cdx id="src" placeholder="Source">
                    {src}
                </Input>
                <Input cdx id="caption" placeholder="Caption">
                    {caption}
                </Input>
            </div>
        </Block>
    ),
    type: "embed-card",
    title: "Embed",
    icon: Icon("frame"),
    validate: data => Boolean(data.src),
    config: {
        inlineToolbar: true,
    },
    render: ({ src, caption }: Data, { trim }) => (
        <embed-card attributes={{ src: trim(src) }} innerHTML={trim(caption) || ""} />
    ),
    parse(node: JsonNode) {
        if (node.type === "embed-card") {
            return {
                src: node.attributes?.src as string ?? "",
                caption: node.content.map(toHTML).join(""),
            }
        }
    },
    save: ({ text, html }) => ({
        src: text("#src"),
        caption: html("#caption"),
    }),
})

declare global {
    interface HTMLElementTagNameMap {
        "embed-card": { attributes: Omit<Data, "caption">, innerHTML: string }
    }
}
