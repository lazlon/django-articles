import { ExternalLink } from "lucide-solid"
import { Block, Input } from "../components"
import { toHTML } from "../parser"
import { defineBlockTool, BlockTool } from "../plugin"
import { asString } from "../utils"

type Data = {
  label: string
  href: string
}

defineBlockTool<Data>({
  type: "link-button",
  renderer: ({ label, href }) => (
    <link-button attr:href={href}>{label}</link-button>
  ),
  parser: (node) => {
    if (node.type == "link-button") {
      const href = node.attributes?.href ?? ""
      return {
        href: href as string,
        label: toHTML(node.content),
      }
    }
  },
  toolbox: {
    title: "Link Button",
    icon: asString(ExternalLink),
  },
  tool: class LinkButton extends BlockTool<Data> {
    defaultData = {
      label: "",
      href: "",
    }

    validate(data: Data) {
      return !!data.href
    }

    render() {
      const [store, set] = this.store

      return (
        <Block class="flex p-1 rounded-lg border-[1pt] border-fg/20">
          {/* <ExternalLink class="my-auto mx-3 text-fg" /> */}
          <div class="flex flex-col grow">
            <div class="flex gap-1">
              <span>href: </span>
              <Input
                class="grow rounded"
                placeholder="href"
                text={store.href}
                onChange={(text) => set("href", text)}
              />
            </div>
            <div class="flex gap-1">
              <span>label: </span>
              <Input
                class="grow rounded"
                placeholder="Label"
                text={store.label}
                onChange={(text) => set("label", text)}
              />
            </div>
          </div>
        </Block>
      )
    }
  },
})

declare global {
  interface HTMLElementTagNameMap {
    "link-button": never
  }
}

declare module "solid-js/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "link-button": {
        "attr:href": string
        children: string
      }
    }
  }
}
