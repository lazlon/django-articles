import { fake } from "../../jsx/state"
import "./Button.css"

export default function Button({
    children,
    className = "",
    ...props
}: JSX.IntrinsicElements["button"]) {
    return <button
        type="button"
        className={fake(className).as(cn => `Button ${cn}`)}
        {...props}>
        {children}
    </button>
}
