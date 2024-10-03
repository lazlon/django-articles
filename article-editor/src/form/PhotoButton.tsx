import { Button } from "@/components"
import { State } from "@/jsx"
import { getPhotoUrl, selectPhoto } from "@/lib/photo"

export class PhotoButton extends HTMLElement {
    static { customElements.define("photo-button", this) }

    #photo = new State({ id: "", src: "" })
    #input = document.createElement("input")

    connectedCallback() {
        this.#photo.subscribe(v => this.#input.value = v.id)

        getPhotoUrl(this)(this.id).then(url => this.#photo.set({
            id: this.id,
            src: url,
        }))

        this.#input.type = "hidden"
        this.append(this.#input)
        this.append(this.render())
    }

    onClick() {
        selectPhoto(this)(1).then(p => {
            if (p && p.length > 0) this.#photo.set(p[0])
        })
    }

    private render = () => <div>
        {this.#photo(({ id, src }) => (id && src)
            ? <img onclick={this.onClick.bind(this)} id={id} src={src} />
            : <Button onclick={this.onClick.bind(this)}>Select Photo</Button>)}
    </div>
}

declare global {
    interface HTMLElementTagNameMap {
        "photo-button": PhotoButton
    }
}
