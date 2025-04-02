import Paperclip from "lucide-solid/icons/paperclip"
import { Block, Input } from "../components"
import { BlockTool, defineBlockTool } from "../plugin"
import { asString } from "../utils"

type Data = {
  file: string
}

defineBlockTool<Data>({
  type: "file-card",
  toolbox: {
    title: "File Card",
    icon: asString(Paperclip),
  },
  parser: (node) => {
    if (node.type === "file-card") {
      return {
        file: node.attributes!.file as string,
      }
    }
  },
  renderer: ({ file }) => <file-card attr:file={file} />,
  tool: class FileCard extends BlockTool<Data> {
    defaultData = { file: "" }

    validate(data: Data) {
      return !!data.file
    }

    render() {
      const [store, set] = this.store

      return (
        <Block class="flex items-center border-[1pt] border-fg/20 rounded-lg p-1 px-2 gap-2">
          <Paperclip />
          <Input
            class="grow"
            text={store.file}
            onChange={(text) => set("file", text)}
          />
        </Block>
      )
    }
  },
})

declare global {
  interface HTMLElementTagNameMap {
    "file-card": never
  }
}

declare module "solid-js/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "file-card": {
        "attr:file": string
      }
    }
  }
}
