import "./Block.css"
import { assignProps } from "jsx/jsx-runtime"

type BlockProps = JSX.IntrinsicElements["div"] & {
    children?: any
    className?: string
}

export default class Block extends HTMLElement {
    static {
        customElements.define("ae-block", this)
    }

    declare body: HTMLElement

    constructor({ children, className = "", ...props }: BlockProps) {
        super()
        this.classList.add("Block")

        if (className)
            this.classList.add(className)

        assignProps(this, props)

        this.body = <div className="body">
            {children}
        </div>

        this.append(this.body)
    }
}
