import { PopoverItemType } from "@editorjs/editorjs"
import { JsonNode, toHTML } from "../parser"
import { defineBlockTool, BlockTool } from "../plugin"
import { asString } from "../utils"
import { Block, Input } from "../components"
import CircleAlert from "lucide-solid/icons/circle-alert"

const emojis = [
  { emoji: "💡", label: "Note" },
  { emoji: "❓", label: "Question" },
  { emoji: "❗", label: "Warning" },
]

const colors = {
  slate: "bg-slate-300 dark:bg-slate-600",
  white: "bg-zinc-100 dark:bg-zinc-900",
  green: "bg-green-300 dark:bg-green-400",
  red: "bg-red-300 dark:bg-red-400",
}

type Data = {
  text: string
  color: keyof typeof colors
  emoji?: string
}

defineBlockTool<Data>({
  type: "callout-card",
  toolbox: {
    title: "Callout Card",
    icon: asString(CircleAlert),
  },
  toolSettings: {
    inlineToolbar: true,
  },
  parser: (node: JsonNode) => {
    if (node.type === "callout-card") {
      const emoji = node.attributes?.emoji ?? ""
      const color = node.attributes?.color ?? "slate"
      return {
        color: color as Data["color"],
        emoji: emoji as string,
        text: toHTML(node.content),
      }
    }
  },
  renderer: ({ text, color, emoji }) => (
    <callout-card attr:color={color} attr:emoji={emoji} innerHTML={text} />
  ),
  tool: class CalloutCard extends BlockTool<Data> {
    defaultData = {
      text: "",
      color: "slate" as const,
      emoji: emojis[0].emoji,
    }

    renderSettings() {
      const [, setData] = this.data

      return [
        ...emojis.map((emoji) => ({
          icon: emoji.emoji,
          label: emoji.label,
          onActivate: () => setData("emoji", emoji.emoji),
        })),
        { type: "separator" as PopoverItemType.Separator },
        ...Object.keys(colors).map((color) => ({
          icon: "",
          // icon: asString(PaintRoller),
          label: color.charAt(0).toUpperCase() + color.slice(1),
          onActivate: () => setData("color", color as keyof typeof colors),
        })),
      ]
    }

    render() {
      const [data, setData] = this.data

      return (
        <Block>
          <div class={`flex ${colors[data.color]} shadow rounded-lg`}>
            <Input
              class="p-2 text-xl rounded-lg"
              text={data.emoji ?? ""}
              onChange={(emoji) => setData("emoji", emoji)}
            />
            <Input
              class="grow p-2 text-wrap rounded-lg"
              text={data.text}
              onChange={(text) => setData("text", text)}
            />
          </div>
        </Block>
      )
    }
  },
})

declare global {
  interface HTMLElementTagNameMap {
    "callout-card": never
  }
}

declare module "solid-js/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "callout-card": {
        "attr:color": string
        "attr:emoji"?: string
        "innerHTML": string
      }
    }
  }
}
