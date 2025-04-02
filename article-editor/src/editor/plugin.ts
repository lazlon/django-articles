import type { JsonNode } from "./parser"
import type * as Editorjs from "@editorjs/editorjs/types/tools"
import { render } from "solid-js/web"
import { createStore, unwrap } from "solid-js/store"
import { JSXElement } from "solid-js"
import { asString } from "./utils"
import type { PhotoApi } from "#/photoApi"

interface BlockToolMeta<Data extends object> {
  type: string
  parser: (node: JsonNode) => void | Data
  renderer: (data: Data) => JSXElement
  toolbox: {
    title: string
    icon: string
  }
  toolSettings?: Omit<Editorjs.ExternalToolSettings, "config" | "class">
  tool: typeof BlockTool<Data>
}

export abstract class BlockTool<Data extends object> {
  declare photoApi: PhotoApi

  abstract render(): JSXElement
  abstract defaultData: Data

  save(): Data {
    return unwrap(this.store[0])
  }

  validate?(data: Data): boolean
  renderSettings?(): Editorjs.MenuConfig

  protected api
  protected block

  protected store!: ReturnType<typeof createStore<Data>>
  private initialData: Data

  element: HTMLElement
  destroy?: () => void

  rendered(): void {
    const data =
      Object.keys(this.initialData).length > 0
        ? this.initialData
        : this.defaultData

    this.destroy = render(() => {
      this.store = createStore(data)
      return this.render()
    }, this.element)
  }

  constructor(config: Editorjs.BlockToolConstructorOptions<Data>) {
    this.api = config.api
    this.block = config.block
    this.initialData = config.data
    this.element = document.createElement("div")
  }
}

export type Parser = (node: JsonNode) => void | { type: string; data: any }
export type Renderer = (data: any) => string

export type BlockToolPlugin = (
  api: PhotoApi & { onChange: () => void },
) => Editorjs.BlockToolConstructable & {
  type: string
  parser: Parser
  renderer: Renderer
  toolSettings: Editorjs.ExternalToolSettings
}

export function defineBlockTool<Data extends object>(
  meta: BlockToolMeta<Data>,
): BlockToolPlugin {
  const plugin: BlockToolPlugin = ({ onChange, ...photoApi }) => {
    return class ToolWrapper implements Editorjs.BlockTool {
      static type = meta.type

      static toolSettings = {
        class: ToolWrapper,
        ...meta.toolSettings,
      }

      static toolbox: Editorjs.ToolboxConfigEntry = {
        title: meta.toolbox.title,
        icon: meta.toolbox.icon,
      }

      static renderer(data: Data) {
        return asString(() => meta.renderer(data))
      }

      static parser(node: JsonNode): { type: string; data: Data } | void {
        const data = meta.parser(node)
        if (data) {
          return { type: meta.type, data }
        }
      }

      private instance: BlockTool<Data>

      constructor(config: Editorjs.BlockToolConstructorOptions<Data>) {
        // @ts-expect-error Tool is not abstract
        this.instance = new meta.tool(config)
        this.instance.photoApi = photoApi
      }

      updated = onChange
      moved = onChange

      rendered() {
        this.instance.rendered()
      }

      destroy() {
        this.instance.destroy?.()
        onChange()
      }

      render() {
        return this.instance.element
      }

      save() {
        return this.instance.save()
      }

      renderSettings() {
        return this.instance.renderSettings?.() || []
      }

      validate(data: Data): boolean {
        if (typeof this.instance.validate == "function")
          return this.instance.validate(data)

        return true
      }
    }
  }

  window.ArticleEditorPlugins ??= []
  window.ArticleEditorPlugins.push(plugin)
  return plugin
}

export function useBlockTool<Data extends object>(
  Tool: Editorjs.BlockToolConstructable,
  meta: Pick<BlockToolMeta<Data>, "type" | "parser" | "renderer"> & {
    toolbox?: {
      title: string
      icon: string
    }
    toolSettings?: Omit<Editorjs.ExternalToolSettings, "class">
  },
): BlockToolPlugin {
  const plugin: BlockToolPlugin = ({ onChange }) => {
    return class ToolWrapper extends Tool {
      static type = meta.type
      static toolbox = meta.toolbox || Tool.toolbox

      static {
        const descriptors = Object.getOwnPropertyDescriptors(Tool)

        for (const [key, descriptor] of Object.entries(descriptors)) {
          if (["name", "length", "prototype", "toolbox"].includes(key)) continue
          Object.defineProperty(this, key, descriptor)
        }
      }

      static toolSettings = {
        class: ToolWrapper,
        ...meta.toolSettings,
      }

      static renderer(data: Data) {
        return asString(() => meta.renderer(data))
      }

      static parser(node: JsonNode): { type: string; data: Data } | void {
        const data = meta.parser(node)
        if (data) {
          return { type: meta.type, data }
        }
      }

      updated() {
        super.updated?.()
        onChange()
      }

      moved(event: Editorjs.MoveEvent) {
        super.moved?.(event)
        onChange()
      }

      destroy() {
        super.destroy?.()
        onChange()
      }
    }
  }

  window.ArticleEditorPlugins ??= []
  window.ArticleEditorPlugins.push(plugin)
  return plugin
}
