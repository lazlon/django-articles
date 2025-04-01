function q(block: HTMLElement) {
    return function <T extends HTMLElement = HTMLElement>(q: string) {
        return block.querySelector<T>(q)!
    }
}

function html(block: HTMLElement) {
    return function <T extends HTMLElement = HTMLElement>(q: string) {
        let html = block.querySelector<T>(q)!.innerHTML
        while (html.endsWith("<br>")) {
            html = html.slice(0, -4)
        }
        return html.trim()
    }
}

function text(block: HTMLElement) {
    return function <T extends HTMLElement = HTMLElement>(q: string) {
        return block.querySelector<T>(q)!.innerText.trim()
    }
}

export function trim(text: string): string
export function trim(text?: string): string | void
export function trim(text?: string) {
    if (!text)
        return

    while (text.endsWith("<br>") || /\s$/.test(text)) {
        text = text.trim()
        text = text.replace(/(<br\s*\/?>)+$/i, "")
    }

    return text
}

export function blockQ<T extends HTMLElement>(block: T) {
    return { block, q: q(block), html: html(block), text: text(block) }
}

export type BlockWithQ<T extends HTMLElement> = ReturnType<typeof blockQ<T>>

export function splitArray<T>(arr: T[], split: (elem: T) => boolean) {
    return arr.reduce((acc, curr) => {
        if (split(curr))
            acc.push([curr])
        else
            acc[acc.length - 1].push(curr)

        return acc
    }, [[]] as T[][])
}
