import { createSignal, JSXElement } from "solid-js"
import { ElementNode, JsonNode, toHTML } from "../parser"
import { BlockTool, defineBlockTool } from "../plugin"
import { Block, Button, Input } from "../components"
import { asString } from "../utils"
import { Image } from "lucide-solid"

type Data = {
  id: string
  caption?: string
  wide: boolean
}

defineBlockTool<Data>({
  type: "image-card",
  renderer: ({ id, caption, wide }) => (
    <image-card attr:wide={wide}>
      <article-photo attr:id={id} />
      {caption && <figcaption innerHTML={caption} />}
    </image-card>
  ),
  parser: (node: JsonNode) => {
    if (node.type === "image-card") {
      const id = node.content[0]
      const fig = node.content[1]
      return {
        id: ((id as ElementNode).attributes?.id as string) || "",
        caption: toHTML(fig),
        wide: !!node.attributes?.wide,
      }
    }
  },
  toolbox: {
    title: "Image Card",
    icon: asString(Image),
  },
  toolSettings: {
    inlineToolbar: true,
  },
  tool: class ImageCard extends BlockTool<Data> {
    defaultData = {
      id: "",
      caption: "",
      wide: false,
    }

    validate(data: Data): boolean {
      return !!data.id
    }

    render() {
      const { getPhotoUrl, selectPhoto } = this.photoApi
      const [src, setSrc] = createSignal("")
      const [store, set] = this.store

      getPhotoUrl(store.id).then((src) => setSrc(src))

      function onClick() {
        selectPhoto(1).then((p) => {
          if (p && p.length > 0) {
            const { id, url } = p[0]
            setSrc(url)
            set("id", id)
          }
        })
      }

      return (
        <Block class="flex flex-col gap-1">
          {store.id && src() ? (
            <img src={src()} onClick={onClick} />
          ) : (
            <Button onClick={onClick}>Select Photo</Button>
          )}
          <Input
            class="px-1.5 py-0.5 rounded-lg border-[1pt] border-fg/20"
            text={store.caption ?? ""}
            onChange={(text) => set("caption", text)}
            placeholder="Caption"
          />
        </Block>
      )
    }
  },
})

declare global {
  interface HTMLElementTagNameMap {
    "image-card": never
  }
}

declare module "solid-js/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "image-card": { "attr:wide": boolean; children: JSXElement }
      "article-photo": { "attr:id": string }
      "gallery-card-row": {}
    }
  }
}
