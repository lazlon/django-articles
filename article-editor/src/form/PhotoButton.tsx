import * as photoApi from "#/photoApi"
import X from "lucide-solid/icons/x"
import { render } from "solid-js/web"
import { createSignal } from "solid-js"
import { Button } from "#/editor/components"

export default function PhotoButton({
  value,
  name,
  api,
}: {
  value: string
  name: string
  api: URL
}) {
  let input: HTMLInputElement
  const [id, setId] = createSignal(value)
  const [src, setSrc] = createSignal("")

  photoApi.getPhotoUrl(api, value).then((url) => {
    if (url) setSrc(url)
  })

  function onClick() {
    photoApi.selectPhoto(api, 1).then((photos) => {
      if (photos && photos.length > 0) {
        const { id, url } = photos[0]
        setId(id)
        setSrc(url)
        input.value = id
        input.dispatchEvent(new Event("input", { bubbles: true }))
      }
    })
  }

  function remove() {
    setId("")
    setSrc("")
  }

  return (
    <div>
      <input
        ref={(el) => (input = el)}
        type="hidden"
        name={name}
        value={value}
      />
      {id() && src() ? (
        <div class="flex flex-col gap-2">
          <img
            class="max-w-32 rounded"
            onClick={onClick}
            id={id()}
            src={src()}
          />
          <Button class="flex items-center mr-auto px-2 py-1" onClick={remove}>
            <span>Remove</span>
            <X />
          </Button>
        </div>
      ) : (
        <Button class="flex mr-auto px-2 py-1" onClick={onClick}>
          Select Photo
        </Button>
      )}
    </div>
  )
}

class PhotoButtonElement extends HTMLElement {
  static {
    customElements.define("photo-button", this)
  }

  connectedCallback() {
    const api = photoApi.getPhotoApiUrl(this)
    const value = this.getAttribute("value") || ""
    const name = this.getAttribute("name") || ""
    render(() => <PhotoButton {...{ value, name, api }} />, this)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "photo-button": PhotoButtonElement
  }
}
