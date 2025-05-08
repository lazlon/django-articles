/**
 * @module
 * Convert from Editorjs json to HTML string and vice versa
 */

export type ElementNode = {
  type: keyof HTMLElementTagNameMap
  attributes?: {
    [attr: string]: unknown
  }
  dataset: DOMStringMap
  content: Array<JsonNode>
}

type SimpleNode = {
  type: "#text" | "#comment"
  content: string
}

export type JsonNode = SimpleNode | ElementNode

function attributesToJSON(map: NamedNodeMap) {
  return Object.fromEntries(
    Array.from(map ?? []).map((attr) => [attr.nodeName, attr.nodeValue]),
  )
}

function attributesToHTML(attr: Record<string, unknown> = {}) {
  const entries = Object.entries(attr)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ")

  return entries ? ` ${entries}` : ""
}

/** tag names are converted to lowercase: e.g: MyWidget -> mywidget */
export function toJSON(node: ChildNode): Array<JsonNode> {
  const nodes = Array.from(node.childNodes).map((node) => {
    switch (node.nodeType) {
      case node.ELEMENT_NODE:
        return {
          // NOTE: nodeName is in UPPERCASE when DOMParser is text/html
          type: node.nodeName.toLowerCase() as keyof HTMLElementTagNameMap,
          attributes: attributesToJSON((node as Element).attributes),
          content: toJSON(node),
          dataset:
            node instanceof HTMLElement ? node.dataset : new DOMStringMap(),
        }

      case node.TEXT_NODE:
        return {
          type: "#text" as const,
          content: node.nodeValue ?? "",
        }

      case node.COMMENT_NODE:
        return {
          type: "#comment" as const,
          content: node.nodeValue ?? "",
        }

      default:
        throw Error(`missing case for node type ${node.nodeType}`)
    }
  })

  // filter out empty text and comment nodes
  return nodes.filter((node) => {
    if (node.type === "#text" || node.type === "#comment")
      return !/^\s*$/.test(node.content)

    return true
  })
}

/** WARNING: PascalCase tags are UNSUPPORTED */
export function toHTML(node?: JsonNode | JsonNode[] | string): string {
  if (!node) {
    return ""
  }

  if (typeof node === "string") {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(toHTML).join(" ")
  }

  switch (node.type) {
    case "#text":
      return node.content
    case "#comment":
      return `<!--${node.content}-->`
    case "img":
    case "hr":
    case "br":
      return `<${node.type} ${attributesToHTML(node.attributes ?? {})}>`
    default: {
      const tag = node.type
      const inner = node.content.map(toHTML).join("")
      const attr = attributesToHTML(node.attributes)
      return `<${tag}${attr}>${inner}</${tag}>`
    }
  }
}
