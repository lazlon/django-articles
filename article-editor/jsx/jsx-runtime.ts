import State, { Binding } from "./state"
type Ctor =
    | keyof HTMLElementTagNameMap
    | ((args: Record<string, any>, ...children: Array<HTMLElement>) => HTMLElement)

type Props = {
    children: Array<any>
    [key: string]: any
}

function isArrowFunction(func: any): func is (args: any) => any {
    return !Object.hasOwn(func, "prototype")
}

function setChildren(elem: HTMLElement, children: Array<ChildNode>) {
    children = children.flat(Infinity).filter(Boolean)
    while (elem.firstChild) {
        if (!children.find(e => e === elem.firstChild)) {
            elem.firstChild.dispatchEvent(new CustomEvent("disconnect", {
                bubbles: false,
            }))
        }

        elem.removeChild(elem.firstChild)
    }
    elem.append(...children)
}

export function append(
    element: HTMLElement,
    children: HTMLElement | Array<HTMLElement | Binding<Array<HTMLElement>>>,
) {
    if (!Array.isArray(children))
        children = [children]

    const ch = mergeBindings(children.flat(Infinity))
    if (ch instanceof Binding) {
        setChildren(element, ch.get())
        const unsub = ch.subscribe(v => setChildren(element, v))
        element.addEventListener("disconnect", unsub)
    }
    else {
        if (ch.length > 0) {
            setChildren(element, ch)
        }
    }
}

function mergeBindings(
    array: Array<HTMLElement | Binding>,
): Array<HTMLElement> | Binding<Array<HTMLElement>> {
    function getValues(...args: any[]) {
        let i = 0
        return array.map(value => value instanceof Binding
            ? args[i++]
            : value,
        )
    }

    const bindings = array.filter(i => i instanceof Binding)

    if (bindings.length === 0)
        return array as Array<HTMLElement>

    if (bindings.length === 1)
        return bindings[0].as(getValues)

    return State.derive(bindings, getValues)()
}

export function assignProps(elem: HTMLElement, props: Record<string, any>) {
    for (const [prop, value] of Object.entries(props) as Array<[keyof typeof elem, any]>) {
        if (elem[prop] && typeof elem[prop] === "object" && typeof value === "object") {
            Object.assign(elem[prop], value)
        }
        else {
            try {
                // @ts-expect-error not writable
                elem[prop] = value
            }
            catch (error) {
                console.error(error)
            }
        }
    }

    if (typeof props.attributes === "object") {
        for (const [key, value] of Object.entries(props.attributes)) {
            if (value != undefined && value != null)
                elem.setAttribute(key, String(value))
        }
    }

    return elem
}

function magic(
    element: HTMLElement,
    { onDisconnect, setup, children, ...props }: {
        onDisconnect?: (e: HTMLElement) => void
        setup?: (e: HTMLElement) => void
        children: Array<HTMLElement | Binding<Array<HTMLElement>>>
        [key: string]: any
    },
) {
    // collect bindings, remove from props
    const bindings: Array<[string, Binding]> = Object.entries(props)
        .filter(([, value]) => value instanceof Binding)
        .map(([key, value]: [string, Binding]) => {
            delete props[key]
            return [key, value]
        })

    // set children
    append(element, children)

    // setup bindings
    for (const [prop, binding] of bindings) {
        const unsub = binding.subscribe(v => {
            assignProps(element, { [prop]: v })
        })
        element.addEventListener("disconnect", unsub)
        assignProps(element, { [prop]: binding.get() })
    }

    assignProps(element, props)

    if (typeof setup === "function")
        setup(element)

    if (typeof onDisconnect === "function")
        element.addEventListener("disconnect", () => onDisconnect(element))

    return element
}

export function jsx(ctor: Ctor, props: Props) {
    props.children ??= []

    if (!Array.isArray(props.children))
        props.children = [props.children]

    if (typeof ctor === "string") {
        // as any is here to allow anything that is declared in HTMLElementTagNameMap
        return magic(document.createElement(ctor as any), props)
    }

    if (isArrowFunction(ctor))
        return ctor(props)

    // @ts-expect-error ctor can be a class or function
    return new ctor(props)
}

type BindableProps<T> = Partial<{
    [K in keyof T]: Binding<T[K]> | T[K];
}>

type ElementMap<Tag extends keyof HTMLElementTagNameMap> =
    BindableProps<Omit<HTMLElementTagNameMap[Tag], "style"> & {
        style: Partial<CSSStyleDeclaration>
    }> & Partial<{
        onDisconnect: (self: HTMLElementTagNameMap[Tag]) => void
        setup: (self: HTMLElementTagNameMap[Tag]) => void
    }>

declare global {
    namespace JSX {
        type Element = HTMLElement
        type IntrinsicElements = {
            [tag in keyof HTMLElementTagNameMap]: ElementMap<tag>
        }
    }
}

export const jsxs = jsx

export function Fragment({ children }: { children?: Array<HTMLElement | Binding> }) {
    return children && mergeBindings(children)
}
