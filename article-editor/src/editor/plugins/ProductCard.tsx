import "./ProductCard.css"
import { BlockPlugin } from "../plugin"
import { toHTML } from "../parser"
import { Block, Icon, Input, Button } from "@/components"
import { State } from "@/jsx"
import { ExternalLink, Tag } from "lucide"

type Data = {
    img: string // id
    title: string
    description: string
    button?: {
        text: string
        href: string
    }
}

export default BlockPlugin({
    Block: ({ img, title, description, button }: Data, { selectPhoto, getPhotoUrl }) => {
        const photo = new State({ id: img, url: "" })

        getPhotoUrl(img).then(url => photo.set({ id: img, url }))

        function onClick() {
            selectPhoto(1).then(p => {
                if (p && p.length > 0) photo.set(p[0])
            })
        }

        return <Block className="ProductCard">
            <div className="body">
                {photo(({ id, url }) => (id && url)
                    ? <img id={id} src={url} onclick={onClick} />
                    : <Button onclick={onClick}>Select Photo</Button>)}
                <Input cdx id="title" placeholder="Title">{title}</Input>
                <Input cdx id="description" placeholder="Description">{description}</Input>
                {button && <div className="cdx-button">
                    <Input cdx id="text" placeholder="Text">{button.text}</Input>
                    <Input cdx id="href" placeholder="Link">{button.href}</Input>
                </div>}
            </div>
        </Block>
    },
    type: "product-card",
    title: "Product",
    icon: Icon(Tag),
    config: {
        inlineToolbar: true,
    },
    validate: ({ img, title, description }) => (
        Boolean(img && title && description)
    ),
    render: ({ img, title, description, button }, { trim }) => (
        <product-card>
            <article-photo attributes={{ id: img }} />
            <product-card-title>{trim(title)}</product-card-title>
            <p innerHTML={trim(description)} />
            {button && <a href={trim(button.href)}>{trim(button.text)}</a>}
        </product-card>
    ),
    parse: node => {
        if (node.type == "product-card") {
            const [photo, title, description, btn] = node.content
            // TODO: assert types
            return {
                // @ts-expect-error
                img: photo.attributes.id,
                // @ts-expect-error
                title: title.content.map(toHTML).join(""),
                // @ts-expect-error
                description: description.content.map(toHTML).join(""),
                ...(btn && {
                    button: {
                        // @ts-expect-error
                        text: btn.content.map(toHTML).join(""),
                        // @ts-expect-error
                        href: btn.attributes.href,
                    },
                }),
            }
        }
    },
    save: ({ block, html, text }) => ({
        img: block.querySelector("img")!.id,
        title: html("#title"),
        description: html("#description"),
        ...(block.querySelector("div.cdx-button") && {
            button: {
                text: html("#text"),
                href: text("#href"),
            },
        }),
    }),
    settings: ({ block }) => ({
        label: "Button",
        icon: Icon(ExternalLink),
        toggle: true,
        isActive: !!block.querySelector("div.cdx-button"),
        onActivate: () => {
            const btn = block.querySelector("div.cdx-button")
            if (btn) {
                btn.parentNode?.removeChild(btn)
            }
            else {
                block.querySelector("div.body")!.append(<div className="cdx-button">
                    <Input cdx id="text" placeholder="Text" />
                    <Input cdx id="href" placeholder="Link" />
                </div>)
            }
        },
    }),
})

declare global {
    interface HTMLElementTagNameMap {
        "product-card": never
        "product-card-title": never
    }
}
