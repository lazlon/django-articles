import { JSXElement } from "solid-js"
import { render } from "solid-js/web"

export function trim(text?: string) {
  if (!text) return ""

  while (text.endsWith("<br>") || /\s$/.test(text)) {
    text = text.trim()
    text = text.replace(/(<br\s*\/?>)+$/i, "")
  }

  return text
}

/**
 * example:
 *
 * ```js
 * splitArray(["a", "b", "c"], e => e === "b")
 * // [["a"], ["b", "c"]]
 * ```
 */
export function splitArray<T>(arr: T[], split: (elem: T) => boolean) {
  return arr.reduce(
    (acc, curr) => {
      if (split(curr)) acc.push([curr])
      else acc[acc.length - 1].push(curr)

      return acc
    },
    [[]] as T[][],
  )
}

/**
 * Alternative to Solid renderToString, since thats server only.
 */
export function asString(child: (props: any) => JSXElement) {
  const parent = document.createElement("div")
  const destroy = render(() => child({}), parent)
  const content = parent.innerHTML
  destroy()
  return content
}
