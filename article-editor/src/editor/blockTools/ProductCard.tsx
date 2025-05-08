import { createSignal, JSXElement } from "solid-js"
import { ElementNode, toHTML } from "../parser"
import { BlockTool, defineBlockTool } from "../plugin"
import { Block, Button, Input } from "../components"
import { MenuConfig } from "@editorjs/editorjs/types/tools"
import { asString } from "../utils"
import Tag from "lucide-solid/icons/tag"

type Data = {
  img: string // id
  title: string
  description: string
  button?: {
    text: string
    href: string
  }
}

defineBlockTool<Data>({
  type: "product-card",
  renderer: ({ img, title, description, button }) => (
    <product-card>
      <article-photo attr:id={img} />
      <product-card-title>{title}</product-card-title>
      <p>{description}</p>
      {button && <a href={button.href}>{button.text}</a>}
    </product-card>
  ),
  parser: (node) => {
    if (node.type === "product-card") {
      const [photo, title, description, btn] = node.content
      return {
        img: ((photo as ElementNode).attributes?.id as string) || "",
        title: toHTML(title.content),
        description: toHTML(description.content),
        ...(btn && {
          button: {
            text: toHTML(btn.content),
            href: ((btn as ElementNode).attributes?.href as string) || "",
          },
        }),
      }
    }
  },
  toolbox: {
    title: "Product",
    icon: asString(Tag),
  },
  tool: class ProductCard extends BlockTool<Data> {
    defaultData = {
      img: "",
      title: "",
      description: "",
    }

    validate(data: Data) {
      return !!data.img
    }

    renderSettings(): MenuConfig {
      const [data, set] = this.data

      return {
        label: "Button",
        // icon: Icon(ExternalLink),
        toggle: true,
        isActive: !!data.button,
        onActivate: () => {
          if (data.button) {
            set("button", void 0)
          } else {
            set("button", { text: "", href: "" })
          }
        },
      }
    }

    render() {
      const { getPhotoUrl, selectPhoto } = this.photoApi
      const [src, setSrc] = createSignal("")
      const [data, set] = this.data

      getPhotoUrl(data.img).then((src) => setSrc(src))

      function onClick() {
        selectPhoto(1).then((p) => {
          if (p && p.length > 0) {
            const { id, url } = p[0]
            setSrc(url)
            set("img", id)
          }
        })
      }

      return (
        <Block>
          <Block class="flex flex-col gap-1 p-2 rounded-lg border-[1pt] border-fg/20">
            {src() ? (
              <img class="rounded" src={src()} onClick={onClick} />
            ) : (
              <Button class="p-1" onClick={onClick}>
                Select Photo
              </Button>
            )}
            <Input
              class="px-1.5 py-0.5 rounded"
              text={data.title ?? ""}
              onChange={(text) => set("title", text)}
              placeholder="Title"
            />
            <Input
              class="px-1.5 py-0.5 rounded"
              text={data.description ?? ""}
              onChange={(text) => set("description", text)}
              placeholder="Caption"
            />
            {data.button && (
              <div class="flex flex-col m-2 p-2 rounded border-[1pt] border-fg/20">
                <Input
                  placeholder="Text"
                  text={data.button.text}
                  onChange={(text) => set("button", "text", text)}
                />
                <Input
                  placeholder="Link"
                  text={data.button.href}
                  onChange={(text) => set("button", "href", text)}
                />
              </div>
            )}
          </Block>
        </Block>
      )
    }
  },
})

declare global {
  interface HTMLElementTagNameMap {
    "product-card": never
  }
}

declare module "solid-js/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "product-card": {
        children: JSXElement
      }
      "product-card-title": {
        children: JSXElement
      }
    }
  }
}
