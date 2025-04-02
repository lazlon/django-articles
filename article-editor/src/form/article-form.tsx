import { Article } from "./types"
import LoaderCircle from "lucide-solid/icons/loader-circle"
import Save from "lucide-solid/icons/save"
import TriangleAlert from "lucide-solid/icons/triangle-alert"
import { createSignal } from "solid-js"
import { render } from "solid-js/web"

const DEBOUNCE = 1000

export class ArticleForm extends HTMLElement {
  static {
    customElements.define("article-form", this)
  }

  connectedCallback() {
    const content = document.querySelector("div#content")
    const form = this.closest("form")!
    const title = document.createElement("input")
    const attributes = JSON.parse(this.getAttribute("attributes")!) as {
      article: Article
    }

    /* the title presented to user is rendered outside of the actual form
     * so we append a hidden input to the form */ {
      form.appendChild(title)
      title.type = "hidden"
      title.name = "title"
      title.value = attributes.article.fields.title
    }

    if (content) {
      const root = document.createElement("div")
      content.querySelector("h1")?.remove() // Change/Add title
      content.querySelector("h2")?.remove() // model insance name
      content.prepend(root)
      render(() => this.render(title, attributes.article), root)
    }
  }

  private render(title: HTMLInputElement, article: Article) {
    const [state, setState] = createSignal<string | boolean>(false)
    const form = this.closest("form")!
    const editor = this.querySelector("article-editor")!
    let debounce: number

    editor.addEventListener("submit", submit)
    form.addEventListener("input", submit)

    function submit() {
      setState(true)
      clearTimeout(debounce)
      debounce = setTimeout(async () => {
        try {
          const res = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
          })

          if (!res.ok) {
            const doc = new DOMParser().parseFromString(
              await res.text(),
              "text/html",
            )
            setState(doc.querySelector("pre.exception_value")!.innerHTML)
          } else {
            setState(false)

            if (form.action.includes("/add")) {
              window.location.href = form.action.replace(
                "/add/",
                `/${article.pk}/change/`,
              )
            }
          }
        } catch (error) {
          console.error(error)
          setState(`Error: ${error instanceof Error ? error.message : error}`)
        }
      }, DEBOUNCE)
    }

    return (
      <div class="flex items-center">
        <input
          style={{ "font-size": "large" }}
          type="text"
          name="title"
          value={article.fields.title}
          onInput={(e) => {
            title.value = e.target.value
            submit()
          }}
        />
        <div class="flex text-lg">
          {state() === true && (
            <>
              <LoaderCircle class="animate-spin" />
              <span>Loading</span>
            </>
          )}
          {state() === false && (
            <>
              <Save />
              <span>Saved</span>
            </>
          )}
          {typeof state() === "string" && (
            <>
              <TriangleAlert />
              <span>Server Error: {state()}</span>
            </>
          )}
        </div>
      </div>
    )
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "article-form": ArticleForm
  }
}
