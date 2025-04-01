import { splitArray } from "./utils"
import type { BlockToolPlugin, Parser, Renderer } from "./plugin"
import EditorJS, { OutputBlockData } from "@editorjs/editorjs"
import { toHTML, toJSON } from "./parser"
import "./blockTools"
import * as photoApi from "./photoApi"

export class ArticleEditor extends HTMLElement {
  public get content() {
    return this._content
  }

  private _content!: Awaited<ReturnType<ArticleEditor["getContent"]>>
  private editor!: EditorJS
  private valueInput!: HTMLInputElement
  private initialContent: string
  private plugins: Array<ReturnType<BlockToolPlugin>>
  private renderers: Record<string, Renderer>
  private parsers: Array<Parser>

  private async submit() {
    this._content = await this.getContent()
    this.valueInput.value = JSON.stringify(this._content)
    this.dispatchEvent(new Event("input"))
    console.log(this.content)
  }

  setContent(html: string) {
    const doc = new DOMParser().parseFromString(html, "text/html")
    this.editor.blocks.insertMany(
      toJSON(doc.body).map((node) => {
        try {
          for (const parse of this.parsers) {
            const block = parse(node)
            if (block) return block
          }
        } catch (error) {
          console.error("could not parse node", error)
        }
        return {
          type: "raw",
          data: {
            html: toHTML(node),
          },
        }
      }),
    )
    this.getContent().then((c) => (this.valueInput.value = JSON.stringify(c)))
  }

  private render(blocks: Array<OutputBlockData>) {
    return blocks.map(({ type, data }) => this.renderers[type](data)).join("")
  }

  async getContent() {
    const { blocks } = await this.editor.save()

    const [excerpt, ...sections] = splitArray(
      blocks,
      (e) => e.type === "header" && e.data.level === 2,
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

    const url = photoApi.getPhotoApiUrl(this)

    this.plugins = window.ArticleEditorPlugins.map((p) =>
      p({
        onChange: this.submit.bind(this),
        selectFile: photoApi.selectFile,
        getPhotoUrl: (id) => photoApi.getPhotoUrl(url, id),
        selectPhoto: (limit) => photoApi.selectPhoto(url, limit),
        uploadPhoto: (file) => photoApi.uploadPhoto(url, file),
        searchPhoto: (text) => photoApi.searchPhoto(url, text),
      }),
    )

    this.renderers = Object.fromEntries(
      this.plugins.map((p) => [p.type, p.renderer]),
    )

    this.parsers = this.plugins.map((p) => p.parser)

    this.initialContent = this.innerHTML
    this.innerHTML = ""
  }

  protected connectedCallback() {
    this.editor = new EditorJS({
      holder: this,
      tools: Object.fromEntries(
        this.plugins.map((p) => [p.type, p.toolSettings]),
      ),
      onReady: () => this.setContent(this.initialContent),
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
    ArticleEditorPlugins: Array<BlockToolPlugin>
  }
}

window.ArticleEditorPlugins ??= []

// define ArticleEditor after window is loaded so that plugins
// injected in other scripts are ready
window.addEventListener("load", () => {
  customElements.define("article-editor", ArticleEditor)
})
