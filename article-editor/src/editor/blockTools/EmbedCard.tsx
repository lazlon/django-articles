import { Block, Input } from "../components"
import { JsonNode, toHTML } from "../parser"
import { BlockTool, defineBlockTool } from "../plugin"
import { asString } from "../utils"
import Frame from "lucide-solid/icons/frame"

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
  renderer: ({ src, caption = "" }) => (
    <embed-card attr:src={src} innerHTML={caption} />
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
      const [data, setData] = this.data

      return (
        <Block class="p-2 border-[1pt] border-fg/20 rounded-lg flex flex-col gap-2">
          <iframe
            class="rounded mb-0"
            src={data.src}
            style={{ border: "none" }}
          />
          <div>
            <Input
              placeholder="Source"
              class="p-0.5 rounded"
              text={data.src}
              onChange={(text) => setData("src", text)}
            />
            <Input
              placeholder="Caption"
              class="p-0.5 rounded"
              text={data.caption ?? ""}
              onChange={(text) => setData("caption", text)}
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
        "innerHTML": string
      }
    }
  }
}
