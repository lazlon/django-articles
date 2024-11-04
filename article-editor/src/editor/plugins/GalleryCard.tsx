import "./GalleryCard.css"
import { State } from "@/jsx"
import { Block, Icon, Input, Button } from "@/components"
import { JsonNode, toHTML } from "../parser"
import { BlockPlugin } from "../plugin"
import { ChevronsLeft, ChevronsRight, Images, X } from "lucide"

type Data = {
    caption?: string
    photos: Array<string>
}

function toRows<T>(items: T[]): T[][] {
    const [a, b, c, d, e, f, g, h, i] = items
    // TODO: logic instead of brute force
    switch (items.length) {
        case 0: return []
        case 1: return [[a]]
        case 2: return [[a, b]]
        case 3: return [[a, b], [c]]
        case 4: return [[a, b], [c, d]]
        case 5: return [[a, b, c], [d, e]]
        case 6: return [[a, b, c], [d, e, f]]
        case 7: return [[a, b, c], [d, e], [f, g]]
        case 8: return [[a, b, c], [d, e, f], [g, h]]
        case 9: return [[a, b, c], [d, e, f], [g, h, i]]
        default: throw Error("TODO: support beyond 9")
    }
}

function shiftItem<T>(items: T[], i: number, pos: 1 | -1) {
    if (i === items.length - 1 && pos === 1)
        return items

    if (i === 0 && pos === -1)
        return items

    const arr = [...items]
    arr[i] = items[i + pos]
    arr[i + pos] = items[i]
    return arr
}

export default BlockPlugin({
    Block: ({ caption, photos = [] }: Data, { selectPhoto, getPhotoUrl }) => {
        const state = new State(photos.map(id => ({ id, url: "" })))

        Promise.all(photos.map(async id => ({ id, url: await getPhotoUrl(id) })))
            .then(arr => state.set(arr))

        function moveImg(id: string, pos: 1 | -1) {
            const x = state.get().findIndex(i => i.id === id)
            state.set([...shiftItem(state.get(), x, pos)])
        }

        function removeImg(id: string) {
            state.set([...state.get().filter(i => i.id !== id)])
        }

        function addImg(limit: number) {
            selectPhoto(limit).then(p => {
                if (p) state.set([...state.get(), ...p])
            })
        }

        return <Block className="gallery-card"
            setup={self => Object.assign(self, { state })}>
            {state(ps => toRows(ps).map(row => (
                <div className="row">
                    {row.map(({ id, url }) => url && (
                        <div className="image">
                            <img src={url} />
                            <div className="buttons">
                                <Button
                                    onclick={() => moveImg(id, -1)}
                                    innerHTML={Icon(ChevronsLeft)}
                                />
                                <Button
                                    onclick={() => moveImg(id, 1)}
                                    innerHTML={Icon(ChevronsRight)}
                                />
                                <Button
                                    onclick={() => removeImg(id)}
                                    innerHTML={Icon(X)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )))}
            {state(ps => ps.length < 9 && <Button
                onclick={() => addImg(9 - ps.length)}>
                Add Photo
            </Button>)}
            <Input id="caption" cdx placeholder="Caption">{caption}</Input>
        </Block>
    },

    type: "gallery-card",
    title: "Gallery",
    icon: Icon(Images),
    validate: data => data.photos.length > 0,

    render: ({ caption, photos }, { trim }) => (
        <gallery-card>
            <gallery-card-container>
                {toRows(photos).map(row => (
                    <gallery-card-row>
                        {row.map(id => (
                            <article-photo attributes={{ id }} />
                        ))}
                    </gallery-card-row>
                ))}
            </gallery-card-container>
            {caption && <figcaption innerHTML={trim(caption)} />}
        </gallery-card>
    ),

    parse: node => {
        if (node.type === "gallery-card") {
            const photos = node.content[0].content as Array<JsonNode>
            const fig = node.content[1]?.content as Array<JsonNode> ?? []
            return {
                caption: fig.map(toHTML).join(""),
                // @ts-expect-error type assert later
                photos: photos.map(row => row.content.map(ps => ps.attributes.id)).flat(),
            }
        }
    },

    save: ({ block, html }) => {
        const { state } = block as unknown as { state: State<Array<{ id: string }>> }
        return {
            caption: html("#caption"),
            photos: state.get().map(p => p.id),
        }
    },
})

declare global {
    interface HTMLElementTagNameMap {
        "gallery-card": never
        "gallery-card-container": never
        "gallery-card-row": never
    }
}
