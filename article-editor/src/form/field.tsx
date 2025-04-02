import type { Tag } from "./types"
import type { JSXElement } from "solid-js"
import Calendar from "lucide-solid/icons/calendar"
import Clock from "lucide-solid/icons/clock"
import PhotoButton from "./PhotoButton"

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

export function TagsField({
  name,
  label,
  required,
  tags,
  value = [],
}: {
  value?: Array<Tag>
  tags: Array<Tag>
  name: string
  label?: string
  required?: boolean
}) {
  return (
    <Field {...{ name, label, required }}>
      <input value="[]" name={name} type="hidden" />
    </Field>
  )
}
