import ParagraphTool from "@editorjs/paragraph"
import { useBlockTool } from "../plugin"
import { toHTML } from "../parser"
import { asString, trim } from "../utils"
import Type from "lucide-solid/icons/type"

type Data = {
  text: string
}

useBlockTool<Data>(ParagraphTool as any, {
  type: "paragraph",
  toolSettings: {
    inlineToolbar: true,
  },
  renderer: ({ text }) => <p innerHTML={trim(text)} />,
  toolbox: {
    title: "Text",
    icon: asString(Type),
  },
  parser: (node) => {
    switch (node.type) {
      case "#text":
        return {
          text: node.content,
        }
      case "p":
        return {
          text: toHTML(node.content),
        }
    }
  },
})
