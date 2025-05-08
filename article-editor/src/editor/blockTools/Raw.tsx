// @ts-expect-error missing types
import RawTool from "@editorjs/raw"
import { useBlockTool } from "../plugin"
import { asString } from "../utils"
import CodeXml from "lucide-solid/icons/code-xml"
import { JSXElement } from "solid-js"
import type { ArticleEditor } from "../article-editor"

type Data = {
  html: string
}

useBlockTool<Data>(RawTool, {
  type: "raw",
  toolbox: {
    title: "HTML",
    icon: asString(CodeXml),
  },
  // HACK:
  // solid does not have a way to render html strings into a fragment
  // as a workaround we use dom api directly
  renderer: ({ html }: Data) => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    const frag = document.createDocumentFragment()
    ;[...temp.childNodes].forEach((node) => frag.appendChild(node))
    return frag as JSXElement
  },
  /**
   * we need to return undefined, because everything is valid content
   * and only use this plugin when the content does not fit for any other plugin
   * see {@link ArticleEditor.prototype.setContent}
   */
  parser: () => void 0,
})
