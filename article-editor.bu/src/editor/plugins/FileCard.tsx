import "./FileCard.css"
import { Block, Icon, Input } from "@/components"
import { BlockPlugin } from "../plugin"
import { Paperclip } from "lucide"

type Data = {
    file: string
}

// TODO: handle file uploads for forms
export default BlockPlugin({
    Block: ({ file }: Data) => (
        <Block className="file-card">
            <div className="main">
                <Icon icon={Paperclip} />
                <Input flat id="file">{file}</Input>
            </div>
        </Block>
    ),
    type: "file-card",
    title: "File",
    icon: Icon(Paperclip),
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
