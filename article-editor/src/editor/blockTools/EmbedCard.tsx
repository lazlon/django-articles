import { Block, Input } from "../components"
import { JsonNode, toHTML } from "../parser"
import { BlockTool, defineBlockTool } from "../plugin"
import { asString } from "../utils"
import { Frame } from "lucide-solid"

type Data = {
  src: string
  caption?: string
}

defineBlockTool<Data>({
  type: "embed-card",
  parser(node: JsonNode) {
    if (node.type === "embed-card") {
      return {
        src: (node.attributes?.src as string) ?? "",
        caption: toHTML(node.content),
      }
    }
  },
  renderer: ({ src, caption }) => (
    <embed-card attr:src={src}>{caption ?? ""}</embed-card>
  ),
  toolbox: {
    title: "Embed Card",
    icon: asString(Frame),
  },
  toolSettings: {
    inlineToolbar: true,
  },
  tool: class EmbedCard extends BlockTool<Data> {
    defaultData = {
      src: "",
      caption: "",
    }

    render() {
      const [store, setStore] = this.store

      return (
        <Block class="p-2 border-[1pt] border-fg/20 rounded-lg flex flex-col gap-2">
          <iframe
            class="rounded mb-0"
            src={store.src}
            style={{ border: "none" }}
          />
          <div>
            <Input
              placeholder="Source"
              class="p-0.5 rounded"
              text={store.src}
              onChange={(text) => setStore("src", text)}
            />
            <Input
              placeholder="Caption"
              class="p-0.5 rounded"
              text={store.caption ?? ""}
              onChange={(text) => setStore("caption", text)}
            />
          </div>
        </Block>
      )
    }
  },
})

declare global {
  interface HTMLElementTagNameMap {
    "embed-card": never
  }
}

declare module "solid-js/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "embed-card": {
        "attr:src": string
        children: string
      }
    }
  }
}
