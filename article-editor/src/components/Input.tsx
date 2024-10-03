import "./Input.css"

type Props = JSX.IntrinsicElements["div"] & {
    children?: any
    cdx?: boolean
    id?: string
    placeholder?: string
}

export default function Input({ children, cdx = false, placeholder = "", ...props }: Props) {
    return <div
        setup={self => {
            self.style.setProperty("--input-placeholder", `"${placeholder}"`)
        }}
        className={`Input ${cdx ? "cdx-input" : ""}`}
        contentEditable="true"
        {...props}>
        {children}
    </div>
}
