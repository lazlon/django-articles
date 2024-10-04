import "./ImageCard.css"
import { Block, Icon, Input, Button } from "@/components"
import { JsonNode, toHTML } from "../parser"
import { BlockPlugin } from "../plugin"
import { State } from "@/jsx"

type Data = {
    id: string
    caption?: string
    wide: boolean
}

export default BlockPlugin({
    Block: ({ id, caption }: Data, { selectPhoto, getPhotoUrl }) => {
        const photo = new State({ id, url: "" })

        getPhotoUrl(id).then(url => photo.set({ id, url }))

        function onClick() {
            selectPhoto(1).then(p => {
                if (p && p.length > 0) photo.set(p[0])
            })
        }

        return <Block className="ImageCard">
            <div id="body">
                {photo(({ id, url }) => (id && url)
                    ? <img id={id} src={url} onclick={onClick} />
                    : <Button onclick={onClick}>Select Photo</Button>)}
            </div>
            <Input cdx id="caption" placeholder="Caption">{caption}</Input>
        </Block>
    },
    type: "image-card",
    title: "Image",
    icon: Icon("image"),
    config: { inlineToolbar: true },
    validate: data => Boolean(data.id),
    render: ({ id, caption, wide }: Data, { trim }) => (
        <image-card attributes={{ wide }}>
            <article-photo attributes={{ id }} />
            {caption && <figcaption>{trim(caption)}</figcaption>}
        </image-card>
    ),
    parse: (node: JsonNode) => {
        if (node.type === "image-card") {
            // @ts-expect-error TODO: assert type
            const { src, id } = node.content[0].attributes as Pick<Data, "src" | "id">
            const fig = node.content[1]?.content ?? []
            return {
                id, src,
                // @ts-expect-error TODO: assert type
                caption: fig.map(toHTML).join(""),
                wide: node.attributes?.wide as boolean,
            }
        }
    },
    save: ({ q, block, html }) => ({
        id: q("img")?.id,
        src: q<HTMLImageElement>("img")?.src,
        wide: typeof block.dataset.wide == "boolean",
        caption: html("#caption"),
    }),
})

declare global {
    interface HTMLElementTagNameMap {
        "article-photo": { attributes: Pick<Data, "id"> }
        "image-card": { attributes: Pick<Data, "wide"> }
    }
}
