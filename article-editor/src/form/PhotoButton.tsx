import { Button, Icon } from "@/components"
import { State } from "@/jsx"
import { getPhotoUrl, selectPhoto } from "@/lib/photo"
import { X } from "lucide"

export default class PhotoButton extends HTMLElement {
    static { customElements.define("photo-button", this) }

    constructor({ attributes }: { attributes?: Record<string, string> } = {}) {
        super()
        if (attributes) {
            for (const [attr, value] of Object.entries(attributes)) {
                if (value) this.setAttribute(attr, value)
            }
        }
    }

    #photo = new State({ id: "", url: "" })
    #input = document.createElement("input")

    connectedCallback() {
        this.#photo.subscribe(v => {
            this.#input.value = v.id
            this.#input.dispatchEvent(new Event("input", { bubbles: true }))
        })

        this.#input.type = "hidden"
        this.#input.name = this.getAttribute("name") || ""
        this.#input.value = this.getAttribute("value") || ""

        getPhotoUrl(this)(this.#input.value).then(url => this.#photo.set({
            id: this.#input.value,
            url,
        }))

        this.append(this.#input)
        this.append(this.render())
    }

    onClick = () => {
        selectPhoto(this)(1).then(p => {
            if (p && p.length > 0) this.#photo.set(p[0])
        })
    }

    remove = () => {
        this.#photo.set({ id: "", url: "" })
    }

    private render = () => (
        <div className="PhotoButton">
            {this.#photo(({ id, url }) => (id && url) ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <img style={{ maxWidth: "20em" }} onclick={this.onClick} id={id} src={url} />
                    <Button style={{ display: "flex", marginRight: "auto" }} onclick={this.remove}>
                        <span>Remove</span>
                        <Icon icon={X} />
                    </Button>
                </div>
            ) : (
                <Button onclick={this.onClick}>Select Photo</Button>
            ))}
        </div>
    )
}

declare global {
    interface HTMLElementTagNameMap {
        "photo-button": PhotoButton
    }
}
