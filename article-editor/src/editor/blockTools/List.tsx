import EditorjsList from "@editorjs/list"
import { useBlockTool } from "../plugin"
import { asString, trim } from "../utils"
import { toHTML } from "../parser"
import List from "lucide-solid/icons/list"

type OrderedData = {
  style: "ordered"
  meta: {
    start: number
    counterType:
      | "numeric"
      | "lower-roman"
      | "upper-roman"
      | "lower-alpha"
      | "upper-alpha"
  }
  items: Array<{
    content: string
    meta: {}
  }>
}

type UnorderedData = {
  style: "unordered"
  items: Array<{
    content: string
    meta: {}
  }>
}

type ChecklistData = {
  style: "checklist"
  items: Array<{
    content: string
    meta: { checked: boolean }
  }>
}

type Data = OrderedData | UnorderedData | ChecklistData

useBlockTool<Data>(EditorjsList as any, {
  type: "list",
  toolbox: {
    title: "List",
    icon: asString(List),
  },
  toolSettings: {
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
      maxLevel: 1, // TODO: support nesting
    },
  },
  renderer: (data) => {
    switch (data.style) {
      case "unordered":
        return (
          <ul>
            {data.items.map((i) => (
              <li innerHTML={trim(i.content)} />
            ))}
          </ul>
        )
      case "ordered":
        return (
          <ol
            data-start={data.meta.start}
            data-counter-type={data.meta.counterType}
          >
            {data.items.map((i) => (
              <li innerHTML={trim(i.content)} />
            ))}
          </ol>
        )
      case "checklist":
        return (
          <ul data-checklist>
            {data.items.map((i) => (
              <li
                {...(i.meta.checked && { "data-checked": "" })}
                innerHTML={trim(i.content)}
              />
            ))}
          </ul>
        )
    }
  },
  parser: (node) => {
    if (node.type === "ol" || node.type === "ul") {
      if (node.type === "ul" && "checklist" in node.dataset) {
        return {
          style: "checklist",
          items: node.content.map((item) => ({
            content: toHTML(item.content),
            meta: { checked: "dataset" in item && "checked" in item.dataset },
            items: [],
          })),
        }
      }

      if (node.type === "ol") {
        return {
          style: "ordered",
          meta: {
            start: parseInt(node.dataset.start ?? "1"),
            counterType:
              (node.dataset
                .counterType as OrderedData["meta"]["counterType"]) ??
              "numeric",
          },
          items: node.content.map((item) => ({
            content: toHTML(item.content),
            meta: {},
            items: [],
          })),
        }
      }

      return {
        style: "unordered",
        items: node.content.map((item) => ({
          content: toHTML(item.content),
          meta: {},
          items: [],
        })),
      }
    }
  },
})
