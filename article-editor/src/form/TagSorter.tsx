import "./TagSorter.css"
import { computePosition } from "@floating-ui/dom"
import { createSwapy } from "swapy"
import { Button, Icon, SearchEntry } from "@/components"
import type { Tag } from "./types"
import { State, Binding, Subscribable } from "@/jsx"

export class MapState<K, T> implements Subscribable {
    #subs = new Set<(v: Array<[K, T]>) => void>()
    map: Map<K, T>

    notifiy() {
        const value = this.get()
        for (const sub of this.#subs) {
            sub(value)
        }
    }

    constructor(initial?: Iterable<[K, T]>) {
        this.map = new Map(initial)
    }

    set(key: K, value: T) {
        if (this.map.has(key))
            return

        this.map.set(key, value)
        this.notifiy()
    }

    delete(key: K) {
        this.map.delete(key)
        this.notifiy()
    }

    get() {
        return [...this.map.entries()]
    }

    subscribe(callback: (v: Array<[K, T]>) => void) {
        this.#subs.add(callback)
        return () => this.#subs.delete(callback)
    }

    bind<R>(callback: (v: Array<[K, T]>) => R) {
        return new Binding(this).as(callback)
    }
}

function AddButton({ tags, onSelect }: {
    tags: Array<Tag>
    onSelect: (id: string) => void
}) {
    let div: HTMLDivElement

    const search = new State("") // TODO: fuzzy search
    const open = new State(false)

    const select = (id: string) => () => {
        open.set(false)
        onSelect(id)
    }

    open.subscribe(v => {
        if (!v) return

        const btn = div.querySelector<HTMLButtonElement>("button.add")!
        const popup = div.querySelector<HTMLDivElement>("div.popup")!
        const entry = div.querySelector<HTMLInputElement>("input[type=\"search\"]")!

        computePosition(btn, popup, {
            placement: "bottom",
        }).then(({ x, y }) => {
            entry.focus()
            Object.assign(popup.style, {
                left: `${x}px`,
                top: `${y}px`,
            })
        })
    })

    function handleWindow(event: MouseEvent | KeyboardEvent) {
        if (event.target && !div.contains(event.target as HTMLElement))
            open.set(false)
        if (event instanceof KeyboardEvent && event.key === "Escape") {
            open.set(false)
        }
    }

    document.addEventListener("keydown", handleWindow)
    document.addEventListener("click", handleWindow)

    return <div
        onDisconnect={() => {
            document.removeEventListener("click", handleWindow)
            document.removeEventListener("keydown", handleWindow)
        }}
        setup={self => div = self}>
        <Button
            className="add"
            onclick={() => open.set(!open.get())}>
            Add  <Icon icon="plus" />
        </Button>
        <div hidden={open(o => !o)} className="popup">
            <SearchEntry placeholder="Tag" onSearch={s => search.set(s.toLowerCase())} />
            <div className="list">
                {search(s => s ? (
                    tags.map(t => t.fields.name.toLowerCase().includes(s) && (
                        <Button onclick={select(t.pk)} className="flat">
                            {t.fields.name}
                        </Button>
                    ))
                ) : (
                    tags.slice(0, 8).map(t => (
                        <Button onclick={select(t.pk)} className="flat">
                            {t.fields.name}
                        </Button>
                    ))
                ))}
            </div>
        </div>
    </div>
}

export default function Tags({ choices, value = [] }: {
    value?: Array<Tag>
    choices: Array<Tag>
}) {
    let input: HTMLInputElement

    const tags = new MapState(value.map((t, i) => [t.pk, {
        name: t.fields.name,
        order: i,
    }]))

    function serialize() {
        input.value = JSON.stringify(tags.get()
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([id]) => id))

        input.dispatchEvent(new Event("input", { bubbles: true }))
    }

    function select(id: string) {
        const tag = choices.find(t => t.pk === id)
        if (tag) {
            tags.set(id, {
                name: tag.fields.name, order: tags.get().length,
            })
            serialize()
        }
    }

    function setup(div: HTMLDivElement) {
        createSwapy(div).onSwapEnd(({ data }) => {
            for (const [order, id] of data.map.entries()) {
                tags.map.get(id!)!.order = Number(order)
            }
            serialize()
        })
    }

    return <div className="Tags">
        <input
            setup={self => {
                input = self
                serialize()
            }}
            type="hidden"
            name="tags"
        />
        {tags.bind(ts => ts.length > 0 && <>
            <div setup={setup} className="swapy">
                {ts
                    .sort(([, a], [, b]) => a.order - b.order)
                    .map(([id, { name }], i) => (
                        <div dataset={{ swapySlot: `${i}` }}>
                            <div dataset={{ swapyItem: id }}>
                                <div className="elem">
                                    <span>{name}</span>
                                    <Button onclick={() => tags.delete(id)}>
                                        <Icon icon="x" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <hr />
        </>)}
        <div style="margin-right: auto">
            <AddButton
                onSelect={select}
                tags={choices}
            />
        </div>
    </div>
}
