import "./LinkButton.css"
import { Block, Icon, Input } from "@/components"
import { toHTML } from "../parser"
import { BlockPlugin } from "../plugin"

type Data = {
    label: string
    href: string
}

export default BlockPlugin({
    Block: ({ label, href }: Data) => (
        <Block className="LinkButton">
            <div className="body cdx-button">
                <Icon icon="external-link" />
                <div className="main">
                    <div className="row">
                        <label>href: </label>
                        <Input id="href" placeholder="href">{href}</Input>
                    </div>
                    <div className="row">
                        <label>label: </label>
                        <Input id="label" placeholder="Label">{label}</Input>
                    </div>
                </div>
            </div>
        </Block>
    ),
    type: "link-button",
    title: "Link Button",
    icon: Icon("external-link"),
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
