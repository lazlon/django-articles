import { selectPhoto, getPhotoUrl } from "@/lib/photo"
import { splitArray } from "./utils"
import { toHTML, toJSON } from "./parser"
import EditorJS, { OutputBlockData } from "@editorjs/editorjs"
import CalloutCard from "./plugins/CalloutCard"
import Paragraph from "./plugins/Paragraph"
import Raw from "./plugins/Raw"
import EmbedCard from "./plugins/EmbedCard"
import FileCard from "./plugins/FileCard"
import GalleryCard from "./plugins/GalleryCard"
import Header from "./plugins/Header"
import ImageCard from "./plugins/ImageCard"
import Line from "./plugins/Line"
import LinkButton from "./plugins/LinkButton"
import List from "./plugins/List"
import Table from "./plugins/Table"
import YourAdHere from "./plugins/YourAdHere"
import ProductCard from "./plugins/ProductCard"

export class ArticleEditor extends HTMLElement {
    static { customElements.define("article-editor", this) }

    public get content() { return this._content }

    private valueInput!: HTMLInputElement
    private editor!: EditorJS
    private initial: string
    private _content!: Awaited<ReturnType<ArticleEditor["getContent"]>>

    private async submit() {
        this._content = await this.getContent()
        this.valueInput.value = JSON.stringify(this._content)
        this.dispatchEvent(new Event("input"))
    }

    private plugins = [
        Paragraph,
        Header,
        CalloutCard,
        ImageCard,
        GalleryCard,
        LinkButton,
        FileCard,
        List,
        Table,
        EmbedCard,
        ProductCard,
        YourAdHere,
        Line,
        Raw,
    ].map(p => p({
        onChange: this.submit.bind(this),
        selectPhoto: selectPhoto(this),
        getPhotoUrl: getPhotoUrl(this),
    }))

    private renderers: Record<string, (data: any) => string> = this.plugins.reduce((acc, p) => ({
        ...acc, [p.type]: p.render,
    }), {})

    private parsers = this.plugins.map(p => p.parse)

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
}
