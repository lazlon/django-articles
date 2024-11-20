import "./Input.css"

type Props = JSX.IntrinsicElements["div"] & {
    children?: any
    flat?: boolean
    id?: string
    placeholder?: string
}

export default function Input({ children, flat = false, placeholder = "", ...props }: Props) {
    return <div
        setup={self => {
            self.style.setProperty("--input-placeholder", `"${placeholder}"`)
        }}
        className={`Input ${flat ? "flat" : ""}`}
        contentEditable="true"
        innerHTML={children}
        {...props}
    />
}
