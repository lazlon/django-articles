import {
    BlockTool,
    BlockToolData,
    ExternalToolSettings,
    MenuConfig,
    MoveEvent,
} from "@editorjs/editorjs/types/tools"
import { API, ToolboxConfigEntry } from "@editorjs/editorjs"
import { type JsonNode } from "./parser"
import { type BlockWithQ, blockQ, trim } from "./utils"
import { type selectPhoto } from "@/lib/photo"

export type PluginProps = {
    onChange: () => void
    selectPhoto: ReturnType<typeof selectPhoto>
    getPhotoUrl: (id: string) => Promise<string>
}

export const BlockPlugin = <
    BlockCtor extends { (args: any, api: PluginProps): HTMLElement },
    Data extends Parameters<BlockCtor>[0],
    Block extends ReturnType<BlockCtor>,
    Q extends BlockWithQ<Block>,
    Type extends string,
>(args: {
    Block: BlockCtor

    type: Type
    title: string
    icon: string
    config?: Omit<ExternalToolSettings, "config" | "class">

    render(data: Data, utils: { trim: typeof trim }): HTMLElement | string
    parse(node: JsonNode): Data | void
    save(args: Q & { api: API }): Data
    validate?(data: Data): boolean
    settings?(args: Q): MenuConfig | HTMLElement
}) => (props: PluginProps) => class Plugin implements BlockTool {
    static type = args.type

    static toolbox: ToolboxConfigEntry = {
        title: args.title,
        icon: args.icon,
    }

    static tool = {
        [args.type]: {
            class: Plugin,
            ...args.config,
        },
    }

    static render(data: Data) {
        const res = args.render(data, { trim })
        if (typeof res === "string")
            return res
        return res.outerHTML
    }

    static parse(node: JsonNode): { type: Type, data: Data } | void {
        const data = args.parse(node)
        if (data) {
            return { type: args.type, data }
        }
    }

    destroy = props.onChange
    updated = props.onChange
    moved = props.onChange

    private block: Block
    private api: API

    constructor({ data, api }: { data: Data, api: API }) {
        this.block = args.Block(data, props) as Block
        this.api = api
    }

    render() {
        return this.block
    }

    save() {
        const q = blockQ(this.block) as Q
        const data = args.save({ api: this.api, ...q })
        return data
    }

    renderSettings(): HTMLElement | MenuConfig {
        return args.settings?.(blockQ(this.block) as Q) || []
    }

    validate(data: Data): boolean {
        if (typeof args.validate == "function")
            return args.validate(data)

        return true
    }
}

export const Extend = <
    Data extends BlockToolData,
    Type extends string,
>(args: {
    Base: {
        toolbox?: ToolboxConfigEntry
        new(...args: any[]): BlockTool
    }
    type: Type
    toolbox?: Omit<ToolboxConfigEntry, "data">
    config?: Omit<ExternalToolSettings, "class">
    render(data: Data, utils: { trim: typeof trim }): HTMLElement | string
    save?(block: HTMLElement, api: API): Data
    parse(node: JsonNode): Data | void
}) => (props: PluginProps) => class Plugin extends (args.Base) implements BlockTool {
    static {
        if (args.toolbox) {
            Object.defineProperty(this, "toolbox", {
                value: args.toolbox,
            })
        }
    }

    static tool = {
        [args.type]: {
            class: Plugin,
            ...args.config,
        },
    }

    static render(data: Data) {
        const res = args.render(data, { trim })
        if (typeof res === "string")
            return res
        return res.outerHTML
    }

    static parse(node: JsonNode): { type: Type, data: Data } | void {
        const data = args.parse(node)
        if (data) {
            return { type: args.type, data }
        }
    }

    static type = args.type

    private api: API

    constructor(args: { data: Data, api: API }) {
        super(args)
        this.api = args.api
    }

    save(block: HTMLElement) {
        return args.save?.(block, this.api) || super.save(block)
    }

    destroy() {
        super.destroy?.()
        props.onChange()
    }

    updated() {
        super.updated?.()
        props.onChange()
    }

    moved(event: MoveEvent): void {
        super.moved?.(event)
        props.onChange()
    }
}

// meant to be used in external scripts
export function addPlugin(plugin: Plugin) {
    window.ExtraPlugins ??= []
    window.ExtraPlugins.push(plugin)
}

export type Plugin = ReturnType<typeof BlockPlugin> | ReturnType<typeof Extend>
export type Parser = (node: JsonNode) => void | { type: string, data: any }
export type Renderer = (data: any) => string
