// @ts-expect-error missing types
import RawTool from "@editorjs/raw"
import { useBlockTool } from "../plugin"
import { asString } from "../utils"
import { CodeXml } from "lucide-solid"

type Data = {
  html: string
}

useBlockTool<Data>(RawTool, {
  type: "raw",
  toolbox: {
    title: "HTML",
    icon: asString(CodeXml),
  },
  renderer: ({ html }: Data) => html,
  // anything thats defined is valid, so we need to return void
  // in order to make non parseable data fallback to a raw type
  parser: () => void 0,
})
