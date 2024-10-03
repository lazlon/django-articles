export interface Subscribable<T = unknown> {
    subscribe(callback: (value: T) => void): () => void
    get(): T
}

export class Binding<T = unknown> implements Subscribable<T> {
    private emitter: Subscribable<T>
    private transformFn = (v: any) => v

    constructor(object: Subscribable<T>) {
        this.emitter = object
    }

    toString() {
        return `Binding<${this.emitter}>`
    }

    as<R>(fn: (v: T) => R): Binding<R> {
        const bind = new Binding(this.emitter)
        bind.transformFn = (v: T) => fn(this.transformFn(v))
        return bind as unknown as Binding<R>
    }

    get(): T {
        return this.transformFn(this.emitter.get())
    }

    subscribe(callback: (value: T) => void): () => void {
        return this.emitter.subscribe(() => {
            callback(this.get())
        })
    }
}

export class State<T> extends Function {
    private value: T
    private listeners: Set<(v: T) => void>
    private derived?: Array<() => void>

    constructor(init: T) {
        super()
        this.listeners = new Set
        this.value = init
        return new Proxy(this, {
            apply: (target, _, args) => target._call(args[0]),
        })
    }

    private _call<R = T>(transform?: (value: T) => R): Binding<R> {
        const b = new Binding(this)
        return transform ? b.as(transform) : b as unknown as Binding<R>
    }

    toString() {
        return `State<${String(this.get())}>`
    }

    get(): T { return this.value }

    set(value: T) {
        if (value !== this.value) {
            this.value = value
            this.listeners.forEach(fn => fn(value))
        }
    }

    subscribe(fn: (v: T) => void) {
        this.listeners.add(fn)
        return () => this.listeners.delete(fn)
    }

    drop() {
        if (this.derived) {
            for (const unsub of this.derived) {
                unsub()
            }
        }
    }

    static derive<
        const Deps extends Array<State<any> | Binding<any>>,
        Args extends {
            [K in keyof Deps]: Deps[K] extends State<infer T>
            ? T : Deps[K] extends Binding<infer T> ? T : never
        },
        V = Args,
    >(deps: Deps, fn: (...args: Args) => V = (...args) => args as unknown as V) {
        const update = () => fn(...deps.map(d => d.get()) as Args)
        const derived = new State(update())
        derived.derived = deps.map(dep => dep.subscribe(() => derived.set(update())))
        return derived
    }

    static fake<T>(binding: Binding<T>): Binding<T>
    static fake<T>(value: T): Binding<T>
    static fake<T>(value: Binding<T> | T) {
        if (value instanceof Binding)
            return value

        return new Binding({
            get: () => value,
            subscribe: () => () => void 0,
        })
    }

    static tmplt(
        strings: TemplateStringsArray,
        ...values: Array<State<any> | Binding<any> | string | number | boolean>
    ) {
        const deps = values.filter(v => v instanceof State || v instanceof Binding)
        const indexes = deps.map(d => values.indexOf(d))

        const evaluate = (...variableValues: any[]) => {
            let v = 0

            const val = (i: number) => indexes.includes(i)
                ? variableValues[v++]
                : (values[i] ?? "")

            return strings
                .flatMap((str, i) => str + `${String(val(i))}`)
                .join("")
        }

        return State.derive(deps, evaluate)
    }
}

export interface State<T = unknown> {
    <R>(transform: (value: T) => R): Binding<R>
    (): Binding<T>
}

export default State
export const { derive, fake, tmplt } = State
