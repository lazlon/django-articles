import Images from "lucide-solid/icons/images"
import { Block } from "../components"
import { JsonNode, toHTML } from "../parser"
import { BlockTool, defineBlockTool } from "../plugin"
import { asString } from "../utils"

type Data = {
  caption?: string
  photos: Array<string>
}

function toRows<T>(items: T[]): T[][] {
  const [a, b, c, d, e, f, g, h, i] = items
  // TODO: logic instead of brute force
  // prettier-ignore
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
  if (i === items.length - 1 && pos === 1) return items

  if (i === 0 && pos === -1) return items

  const arr = [...items]
  arr[i] = items[i + pos]
  arr[i + pos] = items[i]
  return arr
}

defineBlockTool<Data>({
  type: "gallery-card",
  toolSettings: {
    inlineToolbar: true,
  },
  toolbox: {
    title: "Gallery Card",
    icon: asString(Images),
  },
  renderer: ({ caption, photos }) => (
    <gallery-card>
      <gallery-card-container>
        {toRows(photos).map((row) => (
          <gallery-card-row>
            {row.map((id) => (
              <article-photo attr:id={id} />
            ))}
          </gallery-card-row>
        ))}
      </gallery-card-container>
      {caption && <figcaption innerHTML={caption} />}
    </gallery-card>
  ),
  parser: (node) => {
    if (node.type === "gallery-card") {
      const photos = node.content[0].content
      const fig = node.content[1]
      return {
        caption: toHTML(fig),
        photos: (photos as Array<JsonNode>)
          // @ts-expect-error lazy to type assert
          .map((row) => row.content.map((ps) => ps.attributes.id))
          .flat(),
      }
    }
  },
  tool: class GalleryCard extends BlockTool<Data> {
    defaultData = {
      photos: [],
    }

    render() {
      const [store, set] = this.store

      return <Block class="flex flex-col gap-2">GalleryCard</Block>
    }
  },
})

declare global {
  interface HTMLElementTagNameMap {
    "gallery-card": never
  }
}

declare module "solid-js/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "gallery-card": {}
      "gallery-card-container": {}
      "gallery-card-row": {}
    }
  }
}
