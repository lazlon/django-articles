/**
 * @module
 * Convert from Editorjs json to HTML string and vice versa
 */

type ElementNode = {
    type: keyof HTMLElementTagNameMap
    attributes?: {
        [attr: string]: unknown
    }
    content: Array<JsonNode>
}

type SimpleNode = {
    type: "#text" | "#comment"
    content: string
}

export type JsonNode = SimpleNode | ElementNode

function attributesToJSON(map: NamedNodeMap) {
    if (map.length > 0) {
        return Object.values(map).reduce((obj, node) => ({
            ...obj,
            [node.nodeName]: node.nodeValue,
        }), {})
    }
}

function attributesToHTML(attr: { [key: string]: unknown } = {}) {
    const arr = Object.entries(attr)
        .reduce((acc: string[], [key, value]) => acc.concat([`${key}="${value}"`]), [])
        .join(" ")

    return arr ? " " + arr : ""
}

/** tag names are converted to lowercase: e.g: MyWidget -> mywidget */
export function toJSON(node: ChildNode): Array<JsonNode> {
    const nodes = Array.from(node.childNodes).map(node => {
        switch (node.nodeType) {
            case node.ELEMENT_NODE: return {
                // NOTE: nodeName is in UPPERCASE when DOMParser is text/html
                type: node.nodeName.toLowerCase() as keyof HTMLElementTagNameMap,
                attributes: attributesToJSON((node as Element).attributes),
                content: toJSON(node),
            }

            case node.TEXT_NODE: return {
                type: "#text" as const,
                content: node.nodeValue ?? "",
            }

            case node.COMMENT_NODE: return {
                type: "#comment" as const,
                content: node.nodeValue ?? "",
            }

            default: throw Error(`missing case for node type ${node.nodeType}`)
        }
    })

    // filter out empty text and comment nodes
    return nodes.filter(node => {
        if (node.type === "#text" || node.type === "#comment")
            return !/^\s*$/.test(node.content)

        return true
    })
}

/** WARNING: PascalCase tags are UNSUPPORTED */
export function toHTML(node: JsonNode): string {
    switch (node.type) {
        case "#text": return node.content
        case "#comment": return `<!--${node.content}-->`
        case "img": return `<img ${attributesToHTML(node.attributes ?? {})}>`
        default: {
            const tag = node.type
            const inner = node.content.map(toHTML).join("")
            const attr = attributesToHTML(node.attributes)
            return `<${tag}${attr}>${inner}</${tag}>`
        }
    }
}
