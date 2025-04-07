import type { Tag } from "./types"
import Plus from "lucide-solid/icons/plus"
import X from "lucide-solid/icons/x"
import {
  createEffect,
  createSignal,
  createComputed,
  For,
  onCleanup,
  onMount,
  Show,
  type JSXElement,
  createMemo,
  Accessor,
  Setter,
} from "solid-js"
import { createSwapy, type Swapy, utils } from "swapy"
import Calendar from "lucide-solid/icons/calendar"
import Clock from "lucide-solid/icons/clock"
import PhotoButton from "./PhotoButton"
import { createStore } from "solid-js/store"
import { unwrap } from "solid-js/store/types/server.js"
import { Button } from "#/editor/components"
import { computePosition, offset } from "@floating-ui/dom"
import { Portal, untrack } from "solid-js/web"

// NOTE: class is not tailwind but django styles

export function FieldSet({
  title,
  children,
  open = false,
}: {
  title?: string
  open?: boolean
  children?: JSXElement
}) {
  return (
    <fieldset class="module aligned collapse">
      <details open={open}>
        {title && (
          <summary>
            <h2 class="fieldset-heading">{title}</h2>
          </summary>
        )}
        {children}
      </details>
    </fieldset>
  )
}

function Field({
  name,
  label,
  required = false,
  children,
}: {
  name: string
  label?: string
  required?: boolean
  children?: JSXElement
}) {
  label ??= name
    .split("_")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ")

  return (
    <div class={`form-row field-${name}`}>
      <div class="flex-container">
        <label classList={{ required }} for={`id_${name}`}>
          <span>{label}:</span>
        </label>
        {children}
      </div>
    </div>
  )
}

export function SelectField({
  name,
  label,
  required,
  value,
  options,
}: {
  options: Array<[value: string, label: string]>
  value?: string
  name: string
  label?: string
  required?: boolean
}) {
  return (
    <Field {...{ name, label, required }}>
      <select name={name} id={`id_${name}`}>
        {options.map(([v, label]) => (
          <option value={v} selected={v == value}>
            {label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function TextField({
  name,
  label,
  required,
  value = "",
}: {
  value?: string
  name: string
  label?: string
  required?: boolean
}) {
  return (
    <Field {...{ name, label, required }}>
      <input
        type="text"
        id={`id_${name}`}
        name={name}
        value={value}
        class="vTextField"
        maxLength={255}
        required={required}
      />
    </Field>
  )
}

export function BooleanField({
  name,
  label,
  required,
  value,
}: {
  value: boolean
  name: string
  label?: string
  required?: boolean
}) {
  return (
    <Field {...{ name, label, required }}>
      <input
        type="checkbox"
        id={`id_${name}`}
        name={name}
        checked={value}
        class="vBooleanField"
        maxLength={255}
        required={required}
      />
    </Field>
  )
}

export function DateField({
  name,
  label,
  required,
  value,
}: {
  value?: string
  name: string
  label?: string
  required?: boolean
}) {
  const datetime = value ? new Date(value) : new Date()

  const date = datetime.toISOString().split("T")[0]
  const hours = String(datetime.getHours()).padStart(2, "0")
  const minutes = String(datetime.getMinutes()).padStart(2, "0")
  const time = `${hours}:${minutes}`

  return (
    <Field {...{ name, label, required }}>
      <div class="datetime" style="display: flex; flex-direction: column;">
        <div style="display: flex;">
          <Calendar size={16} />
          <input
            type="date"
            id={`id_${name}_0`}
            name={`${name}_0`}
            value={value ? date : ""}
            required={required}
          />
        </div>
        <div style="display: flex;">
          <Clock size={16} />
          <input
            type="time"
            id={`id_${name}_1`}
            name={`${name}_1`}
            value={value ? time : ""}
            required={required}
          />
        </div>
      </div>
    </Field>
  )
}

export function PhotoField({
  name,
  label,
  required,
  value = "",
  photoapi,
}: {
  value?: string
  name: string
  label?: string
  required?: boolean
  photoapi: URL
}) {
  return (
    <Field {...{ name, label, required }}>
      <PhotoButton api={photoapi} value={value} name={name} />
    </Field>
  )
}

export function LargeTextField({
  name,
  label,
  required,
  value = "",
}: {
  value?: string
  name: string
  label?: string
  required?: boolean
}) {
  return (
    <Field {...{ name, label, required }}>
      <textarea
        id={`id_${name}`}
        name={name}
        cols={20}
        rows={10}
        class="vLargeTextField"
      >
        {value}
      </textarea>
    </Field>
  )
}

function TagSorter(props: { value: Array<Tag>; onChange: Setter<Array<Tag>> }) {
  let container!: HTMLDivElement
  let swapy: Swapy

  createEffect(() => {
    props.value // dependancy
    if (swapy) swapy.destroy()

    swapy = createSwapy(container)
    swapy.onSwapEnd((event) => {
      if (event.hasChanged) {
        props.onChange((tags) =>
          event.slotItemMap.asArray.map(
            ({ item: pk }) => tags.find((tag) => tag.pk === pk)!,
          ),
        )
      }
    })
  })

  onCleanup(() => {
    swapy.destroy()
  })

  function remove(tag: Tag) {
    props.onChange((tags) => tags.filter(({ pk }) => pk !== tag.pk))
  }

  return (
    <div ref={container} class="flex flex-col gap-1 w-28">
      {props.value.map((tag, i) => (
        <div data-swapy-slot={i}>
          {tag && (
            <div
              class="flex justify-between items-center bg-fg/4 rounded-xl hover:bg-fg/8 p-1 transition-colors"
              data-swapy-item={tag.pk}
            >
              <span class="ml-1">{tag.fields.name}</span>
              <Button class="flex items-center p-1" onClick={() => remove(tag)}>
                <X size={12} />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function TagsField({
  name,
  label,
  required,
  choices,
  value = [],
}: {
  value?: Array<Tag>
  choices: Array<Tag>
  name: string
  label?: string
  required?: boolean
}) {
  let input: HTMLInputElement
  let container: HTMLElement
  let popup: HTMLElement
  let button: HTMLElement

  const [tags, setTags] = createSignal(value)
  const [showPopup, setShowPopup] = createSignal(false)
  const [search, setSearch] = createSignal("")

  function handleWindow(event: MouseEvent | KeyboardEvent) {
    if (!showPopup()) return

    if (
      event.target &&
      !container.contains(event.target as HTMLElement) &&
      !popup.contains(event.target as HTMLElement)
    )
      setShowPopup(false)

    if (event instanceof KeyboardEvent && event.key === "Escape") {
      setShowPopup(false)
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleWindow)
    window.addEventListener("click", handleWindow)
  })

  onCleanup(() => {
    window.removeEventListener("keydown", handleWindow)
    window.removeEventListener("click", handleWindow)
  })

  createEffect(() => {
    input.value = JSON.stringify(tags().map((t) => t.pk))
    input.dispatchEvent(new Event("input", { bubbles: true }))
  })

  createEffect(async () => {
    if (showPopup()) {
      const { x, y } = await computePosition(button, popup, {
        placement: "bottom",
        middleware: [offset(8)],
      })

      popup.style.left = `${x}px`
      popup.style.top = `${y}px`
    }
  })

  function openPopup() {
    setTimeout(() => setShowPopup(true))
  }

  function addTag(tag: Tag) {
    setTags((tags) => [...tags, tag])
  }

  return (
    <Field {...{ name, label, required }}>
      <input ref={(el) => (input = el)} name={name} type="hidden" />
      <div class="flex flex-col" ref={(el) => (container = el)}>
        <TagSorter value={tags()} onChange={setTags} />
        <Button
          ref={(el) => (button = el)}
          class="flex items-center relative px-1.5 py-1 mt-4 mr-auto gap-2"
          onClick={openPopup}
        >
          Add <Plus size={14} />
        </Button>
        <Show when={showPopup()}>
          <Portal>
            <div
              class="bg-bg rounded-xl shadow-lg absolute flex flex-col p-2 gap-1"
              ref={(el) => (popup = el)}
            >
              <input
                onInput={(e) => setSearch(e.target.value)}
                placeholder="Search"
                class="border-none"
              />
              <For each={choices}>
                {(choice) => (
                  <Show
                    when={
                      !tags()
                        .map((t) => t.pk)
                        .includes(choice.pk) &&
                      choice.fields.name
                        .toLowerCase()
                        .includes(search().toLowerCase())
                    }
                  >
                    <Button
                      class="text-left py-1 px-2"
                      onClick={() => addTag(choice)}
                    >
                      {choice.fields.name}
                    </Button>
                  </Show>
                )}
              </For>
            </div>
          </Portal>
        </Show>
      </div>
    </Field>
  )
}
