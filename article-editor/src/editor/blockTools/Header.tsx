import Header from "@editorjs/header"
import { asString, trim } from "../utils"
import { useBlockTool } from "../plugin"
import { toHTML } from "../parser"
import Heading from "lucide-solid/icons/heading"

type Data = {
  level: 2 | 3 | 4
  text: string
}

useBlockTool<Data>(Header as any, {
  type: "header",
  toolbox: {
    title: "Heading",
    icon: asString(Heading),
  },
  toolSettings: {
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+H",
    config: {
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  renderer: ({ level, text }) => {
    switch (level) {
      case 2:
        return <h2 innerHTML={trim(text)} />
      case 3:
        return <h3 innerHTML={trim(text)} />
      case 4:
        return <h4 innerHTML={trim(text)} />
    }
  },
  parser: (node) => {
    if (node.type === "h2" || node.type === "h3" || node.type === "h4") {
      return {
        level: parseInt(node.type[1]) as Data["level"],
        text: toHTML(node.content),
      }
    }
  },
})
