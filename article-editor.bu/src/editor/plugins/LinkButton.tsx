import "./LinkButton.css"
import { Block, Icon, Input } from "@/components"
import { toHTML } from "../parser"
import { BlockPlugin } from "../plugin"
import { ExternalLink } from "lucide"

type Data = {
    label: string
    href: string
}

export default BlockPlugin({
    Block: ({ label, href }: Data) => (
        <Block className="LinkButton">
            <Icon icon={ExternalLink} />
            <div className="main">
                <div className="row">
                    <span className="label">href: </span>
                    <Input flat id="href" placeholder="href">{href}</Input>
                </div>
                <div className="row">
                    <span className="label">label: </span>
                    <Input flat id="label" placeholder="Label">{label}</Input>
                </div>
            </div>
        </Block>
    ),
    type: "link-button",
    title: "Link Button",
    icon: Icon(ExternalLink),
    validate: data => Boolean(data.href && data.label),
    config: {
        inlineToolbar: true,
    },
    render: ({ label, href }: Data, { trim }) => (
        <link-button attributes={{ href: trim(href) }} innerHTML={trim(label)} />
    ),
    parse: node => {
        if (node.type == "link-button") {
            const href = node.attributes?.href ?? ""
            return {
                href: href as string,
                label: node.content.map(toHTML).join(""),
            }
        }
    },
    save: ({ text, html }) => ({
        href: text("#href"),
        label: html("#label"),
    }),
})

declare global {
    interface HTMLElementTagNameMap {
        "link-button": { attributes: Pick<Data, "href">, innerHTML: string }
    }
}
