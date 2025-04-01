import { State } from "@/jsx"
import { Icon } from "@/components"
import { Article } from "./types"
import { LoaderCircle, Save, TriangleAlert } from "lucide"

const DEBOUNCE = 1000

export class ArticleForm extends HTMLElement {
    static { customElements.define("article-form", this) }

    private state = new State<boolean | string>(false)

    private debounce!: number
    private form!: HTMLFormElement
    private articleId!: string

    private async submit() {
        this.state.set(true)
        clearTimeout(this.debounce)

        this.debounce = setTimeout(async () => {
            try {
                const res = await fetch(this.form.action, {
                    method: "POST",
                    body: new FormData(this.form),
                })

                if (!res.ok) {
                    const doc = new DOMParser().parseFromString(await res.text(), "text/html")
                    this.state.set(doc.querySelector("pre.exception_value")!.innerHTML)
                }
                else {
                    this.state.set(false)
                    console.log(document.querySelector("article-editor")?.content)

                    if (this.form.action.includes("/add")) {
                        window.location.href = this.form.action
                            .replace("/add/", `/${this.articleId}/change/`)
                    }
                }
            }
            catch (error) {
                console.error(error)
                this.state.set(`Error: ${error instanceof Error ? error.message : error}`)
            }
        }, DEBOUNCE)
    }

    connectedCallback() {
        const attributes = JSON.parse(this.getAttribute("attributes")!) as {
            article: Article
        }

        this.form = this.closest("form")!
        this.articleId = attributes.article.pk

        const editor = this.querySelector("article-editor")
        const form = this.closest("form")

        if (editor && form) {
            editor.addEventListener("submit", this.submit.bind(this))
            this.form.addEventListener("input", this.submit.bind(this))
            this.form = form
        }

        document.addEventListener("DOMContentLoaded", () => {
            const content = document.querySelector("div#content")
            if (content) {
                content.querySelector("h1")?.remove() // Change/Add title
                content.querySelector("h2")?.remove() // model insance name
                content.prepend(this.render(attributes.article.fields.title))
            }
        })
    }

    #render(state: boolean | string) {
        switch (state) {
            case true: return <>
                <Icon icon={LoaderCircle} className="spinner" />
                <span>Loading</span>
            </>
            case false: return <>
                <Icon icon={Save} />
                <span>Saved</span>
            </>
            default: return <>
                <Icon icon={TriangleAlert} />
                <span>Server Error: {state}</span>
            </>
        }
    }

    private setup(title: HTMLInputElement) {
        this.append(<input
            setup={self => title.addEventListener("input", () => {
                self.value = title.value
                this.submit()
            })}
            type="hidden"
            name="title"
            id="id_title"
            value={title.value}
        />)
    }

    private render = (title: string) => (
        <div id="content-header" style="display: flex">
            <input setup={this.setup.bind(this)} value={title} />
            <div style="display: flex; font-size: large;">
                {this.state(this.#render.bind(this))}
            </div>
        </div>
    )
}

declare global {
    interface HTMLElementTagNameMap {
        "article-form": ArticleForm
    }
}
