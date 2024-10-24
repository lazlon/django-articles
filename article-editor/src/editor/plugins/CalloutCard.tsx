import "./CalloutCard.css"
import { Block, Input, Icon } from "@/components"
import { BlockPlugin } from "../plugin"
import { type JsonNode, toHTML } from "../parser"
import { type PopoverItemType } from "@editorjs/editorjs"

const colors = ["slate", "white", "green", "red"] as const

const emojis = [
    { emoji: "💡", label: "Note" },
    { emoji: "❓", label: "Question" },
    { emoji: "❗", label: "Warning" },
]

type Data = {
    text: string
    color: typeof colors[number]
    emoji?: string
}

export default BlockPlugin({
    Block: ({ emoji, color = "slate", text }: Data) => (
        <Block className="callout-card">
            <div id="body" dataset={{ color }}>
                <Input id="emoji">
                    {text ? (emoji ?? "") : emojis[0].emoji}
                </Input>
                <Input id="text" placeholder="Card content...">
                    {text}
                </Input>
            </div>
        </Block>
    ),
    type: "callout-card",
    title: "Callout",
    icon: Icon("circle-alert"),
    config: {
        inlineToolbar: true,
    },
    save: ({ q, html, text }) => ({
        text: html("#text"),
        emoji: text("#emoji"),
        color: q("#body").dataset.color as typeof colors[number],
    }),
    validate: data => Boolean(data.text),
    render: ({ emoji, text, color = "slate" }: Data, { trim }) => (
        <callout-card attributes={{ emoji: trim(emoji)!, color }} innerHTML={trim(text)} />
    ),
    parse: (node: JsonNode) => {
        if (node.type === "callout-card") {
            const emoji = node.attributes?.emoji ?? ""
            const color = node.attributes?.color ?? "slate"
            return {
                color: color as Data["color"],
                emoji: emoji as string,
                text: node.content.map(toHTML).join(""),
            }
        }
    },
    // TODO: add color icons, name emojis
    settings: ({ q }) => [
        ...emojis.map(emoji => ({
            icon: emoji.emoji,
            label: emoji.label,
            onActivate: () => q("#emoji").innerText = emoji.emoji,
        })),
        { type: "separator" as PopoverItemType.Separator },
        ...colors.map(color => ({
            icon: Icon("paint-roller"),
            label: color.charAt(0).toUpperCase() + color.slice(1),
            onActivate: () => q("#body").dataset.color = color,
        })),
    ],
})

declare global {
    interface HTMLElementTagNameMap {
        "callout-card": { attributes: Omit<Data, "text">, innerHTML: string }
    }
}
