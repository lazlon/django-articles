import { Icon } from "@/components"
import TagSorter from "./TagSorter"
import PhotoButton from "./PhotoButton"
import { Tag } from "./types"
import { Calendar, Clock } from "lucide"

export function FieldSet({ title, children, open = false }: {
    title?: string
    open?: boolean
    children?: Array<JSX.Element>
}) {
    return <fieldset className="module aligned collapse">
        <details open={open}>
            {title && <summary>
                <h2 className="fieldset-heading">
                    {title}
                </h2>
            </summary>}
            {children}
        </details>
    </fieldset>
}

function Field({ name, label, required = false, children }: {
    name: string
    label?: string
    required?: boolean
    children?: JSX.Element
}) {
    label ??= name
        .split("_")
        .map(str => str.charAt(0).toUpperCase() + str.slice(1))
        .join(" ")

    return <div className={`form-row field-${name}`}>
        <div className="flex-container">
            <label className={required ? "required" : ""} htmlFor={`id_${name}`}>
                <span>{label}:</span>
            </label>
            {children}
        </div>
    </div>
}

export function SelectField({ name, label, required, value, options }: {
    options: Array<[value: string, label: string]>
    value?: string
    name: string
    label?: string
    required?: boolean
}) {
    return <Field {...{ name, label, required }}>
        <select name={name} id={`id_${name}`}>
            {options.map(([v, label]) => (
                <option value={v} selected={v == value}>{label}</option>
            ))}
        </select>
    </Field>
}

export function TextField({ name, label, required, value = "" }: {
    value?: string
    name: string
    label?: string
    required?: boolean
}) {
    return <Field {...{ name, label, required }}>
        <input
            type="text"
            id={`id_${name}`}
            name={name}
            value={value}
            className="vTextField"
            maxLength={255}
            required={required}
        />
    </Field>
}

export function BooleanField({ name, label, required, value }: {
    value: boolean
    name: string
    label?: string
    required?: boolean
}) {
    return <Field {...{ name, label, required }}>
        <input
            type="checkbox"
            id={`id_${name}`}
            name={name}
            checked={value}
            className="vBooleanField"
            maxLength={255}
            required={required}
        />
    </Field>
}

export function DateField({ name, label, required, value }: {
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

    return <Field {...{ name, label, required }}>
        <div className="datetime" style="display: flex; flex-direction: column;">
            <div style="display: flex;">
                <Icon icon={Calendar} />
                <input
                    type="date"
                    id={`id_${name}_0`}
                    name={`${name}_0`}
                    value={value ? date : ""}
                    required={required}
                />
            </div>
            <div style="display: flex;">
                <Icon icon={Clock} />
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
}

export function PhotoField({ name, label, required, value = "", photoapi }: {
    value?: string
    name: string
    label?: string
    required?: boolean
    photoapi: string
}) {
    return <Field {...{ name, label, required }}>
        <PhotoButton attributes={{ name, value, photoapi }} />
    </Field>
}

export function LargeTextField({ name, label, required, value = "" }: {
    value?: string
    name: string
    label?: string
    required?: boolean
}) {
    return <Field {...{ name, label, required }}>
        <textarea
            id={`id_${name}`}
            name={name}
            cols={20}
            rows={10}
            className="vLargeTextField" >
            {value}
        </textarea>
    </Field>
}

export function TagsField({ name, label, required, tags, value = [] }: {
    value?: Array<Tag>
    tags: Array<Tag>
    name: string
    label?: string
    required?: boolean
}) {
    return <Field {...{ name, label, required }}>
        <TagSorter
            choices={tags}
            value={value}
        />
    </Field>
}
