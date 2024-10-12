import "./FileCard.css"
import { Block, Icon, Input } from "@/components"
import { BlockPlugin } from "../plugin"

type Data = {
    file: string
}

// TODO: handle file uploads for forms
export default BlockPlugin({
    Block: ({ file }: Data) => (
        <Block className="file-card">
            <div className="body">
                <Icon icon="paperclip" />
                <Input id="file">{file}</Input>
            </div>
        </Block>
    ),
    type: "file-card",
    title: "File",
    icon: Icon("paperclip"),
    validate: data => Boolean(data.file),
    render: ({ file }, { trim }) => (
        <file-card attributes={{ file: trim(file) }} />
    ),
    parse: node => {
        if (node.type === "file-card") {
            return {
                file: node.attributes!.file as string,
            }
        }
    },
    save: ({ text }) => ({
        file: text("#file"),
    }),
})

declare global {
    interface HTMLElementTagNameMap {
        "file-card": { attributes: Data }
    }
}
