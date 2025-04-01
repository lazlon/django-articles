import { selectPhoto, getPhotoUrl } from "@/lib/photo"
import { splitArray } from "./utils"
import { toHTML, toJSON } from "./parser"
import EditorJS, { OutputBlockData } from "@editorjs/editorjs"
import type { Plugin, Parser, Renderer } from "./plugin"
import CalloutCard from "./plugins/CalloutCard"
import EmbedCard from "./plugins/EmbedCard"
import FileCard from "./plugins/FileCard"
import GalleryCard from "./plugins/GalleryCard"
import Header from "./plugins/Header"
import ImageCard from "./plugins/ImageCard"
import Line from "./plugins/Line"
import LinkButton from "./plugins/LinkButton"
import List from "./plugins/List"
import Paragraph from "./plugins/Paragraph"
import ProductCard from "./plugins/ProductCard"
import Raw from "./plugins/Raw"
import Table from "./plugins/Table"

export class ArticleEditor extends HTMLElement {
    public get content() { return this._content }

    private valueInput!: HTMLInputElement
    private editor!: EditorJS
    private initial: string
    private _content!: Awaited<ReturnType<ArticleEditor["getContent"]>>
    private plugins: Array<ReturnType<Plugin>>
    private renderers: Record<string, Renderer>
    private parsers: Array<Parser>

    private async submit() {
        this._content = await this.getContent()
        this.valueInput.value = JSON.stringify(this._content)
        this.dispatchEvent(new Event("input"))
    }

    setContent(html: string) {
        const doc = new DOMParser().parseFromString(html, "text/html")
        this.editor.blocks.insertMany(toJSON(doc.body).map(node => {
            try {
                for (const parse of this.parsers) {
                    const block = parse(node)
                    if (block)
                        return block
                }
            }
            catch (error) {
                console.error("could not parse node", error)
            }
            return {
                type: "raw",
                data: {
                    html: toHTML(node),
                },
            }
        }))
        this.getContent().then(c => this.valueInput.value = JSON.stringify(c))
    }

    private render(blocks: Array<OutputBlockData>) {
        return blocks
            .map(({ type, data }) => this.renderers[type](data))
            .join("")
    }

    async getContent() {
        const { blocks } = await this.editor.save()

        const [excerpt, ...sections] = splitArray(
            blocks,
            e => e.type === "header" && e.data.level === 2,
        )

        return {
            excerpt: this.render(excerpt),
            sections: sections.map(([head, ...content], i) => ({
                order: i,
                title: head.data.text,
                content: this.render(content),
            })),
        }
    }

    constructor() {
        super()

        const plugins = [
            CalloutCard,
            EmbedCard,
            FileCard,
            GalleryCard,
            Header,
            ImageCard,
            Line,
            LinkButton,
            List,
            Paragraph,
            ProductCard,
            Raw,
            Table,
            ...(window.ExtraPlugins || []),
        ]

        this.plugins = plugins.map(p => p({
            onChange: this.submit.bind(this),
            selectPhoto: selectPhoto(this),
            getPhotoUrl: getPhotoUrl(this),
        }))

        this.renderers = this.plugins.reduce((acc, p) => ({
            ...acc, [p.type]: p.render,
        }), {})

        this.parsers = this.plugins.map(p => p.parse)

        this.initial = this.innerHTML
        this.innerHTML = ""
    }

    protected connectedCallback() {
        this.editor = new EditorJS({
            holder: this,
            tools: this.plugins.reduce((acc, p) => ({ ...acc, ...p.tool }), {}),
            onReady: () => {
                this.classList.add("ready")
                this.setContent(this.initial)
            },
        })

        this.valueInput = Object.assign(document.createElement("input"), {
            type: "hidden",
            name: this.getAttribute("name"),
        })

        this.append(this.valueInput)
    }

    protected disconnectedCallback() {
        this.editor.destroy()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "article-editor": ArticleEditor
    }

    interface Window {
        ExtraPlugins: Array<Plugin> | undefined
    }
}

// define ArticleEditor after window is loaded so that plugins
// injected in other scripts are ready
window.addEventListener("load", () => {
    customElements.define("article-editor", ArticleEditor)
})
