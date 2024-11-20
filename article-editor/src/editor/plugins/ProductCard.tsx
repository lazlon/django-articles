import "./ProductCard.css"
import { BlockPlugin, PluginProps } from "../plugin"
import { toHTML } from "../parser"
import { Block, Icon, Input, Button } from "@/components"
import { State } from "@/jsx"
import { ExternalLink, Tag } from "lucide"
import { append } from "jsx/jsx-runtime"

type Data = {
    img: string // id
    title: string
    description: string
    button?: {
        text: string
        href: string
    }
}

class ProductCard extends Block {
    static {
        customElements.define("ae-product-card", this)
    }

    photo: State<{ id: string, url: string }>

    constructor(
        { img, title, description, button }: Data,
        { selectPhoto, getPhotoUrl }: PluginProps,
    ) {
        super({ className: "ProductCard" })
        this.photo = new State({ id: img, url: "" })

        getPhotoUrl(img).then(url => this.photo.set({ id: img, url }))

        const onClick = () => {
            selectPhoto(1).then(p => {
                if (p && p.length > 0) this.photo.set(p[0])
            })
        }

        append(this.body, <>
            {this.photo(({ id, url }) => (id && url) ? (
                <img id={id} src={url} onclick={onClick} />
            ) : (
                <Button onclick={onClick}>Select Photo</Button>
            ))}
            <Input flat id="title" placeholder="Title">{title}</Input>
            <Input flat id="description" placeholder="Description">{description}</Input>
        </>)

        if (button) this.addButton()
    }

    get hasButton() {
        return !!this.querySelector("div.button")
    }

    private addButton({ text = "", href = "" } = {}) {
        this.body.append(<div className="button">
            <Input flat id="text" placeholder="Text">{text}</Input>
            <Input flat id="href" placeholder="Link">{href}</Input>
        </div>)
    }

    toggleButton() {
        if (this.hasButton) {
            this.querySelector("div.button")?.remove()
        } else {
            this.addButton()
        }
    }
}

export default BlockPlugin({
    Block: (props, pluginprops) => new ProductCard(props, pluginprops),
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
        img: block.photo.get().id,
        title: html("#title"),
        description: html("#description"),
        ...(block.hasButton && {
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
        isActive: block.hasButton,
        onActivate: () => block.toggleButton(),
    }),
})

declare global {
    interface HTMLElementTagNameMap {
        "product-card": never
        "product-card-title": never
    }
}
