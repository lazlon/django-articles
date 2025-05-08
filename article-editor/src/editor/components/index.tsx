import { JSXElement, onMount, createEffect, JSX } from "solid-js"
import { trim } from "../utils"

export function Block(props: { children: JSXElement; class?: string }) {
  return (
    <div class="text-fg py-5 flex flex-col">
      <div class={props.class}>{props.children}</div>
    </div>
  )
}

export function Button(props: {
  children: JSXElement
  class?: string
  ref?: (el: HTMLButtonElement) => void
  onClick: JSX.CustomEventHandlersCamelCase<HTMLButtonElement>["onClick"]
}) {
  return (
    <button
      ref={props.ref}
      type="button"
      onClick={props.onClick}
      class={
        "border-none transition rounded-lg " +
        "bg-fg/10 hover:bg-fg/14 active:bg-fg/18 " +
        props.class
      }
    >
      {props.children}
    </button>
  )
}

export function Input(props: {
  children?: JSXElement
  class?: string
  text: string
  placeholder?: string
  onChange: (text: string) => void
}) {
  let div: HTMLDivElement

  createEffect(() => {
    if (div.innerHTML !== props.text) {
      div.innerHTML = props.text ?? ""
    }
  })

  onMount(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          props.onChange(trim(div.innerHTML))
        }
      }
    })

    observer.observe(div, {
      childList: true,
      characterData: true,
      subtree: true,
    })
  })

  return (
    <div
      ref={(el) => (div = el)}
      // @ts-expect-error setting it to `true` will result in pasting text misbehaving
      contentEditable={"true"}
      style={
        props.text ? {} : { "--placeholder": `"${props.placeholder ?? ""}"` }
      }
      class={`before:content-(--placeholder) before:text-fg/50 ${props.class}`}
    />
  )
}
