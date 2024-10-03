import "./Block.css"

type BlockProps = JSX.IntrinsicElements["div"] & {
    children?: any
    className?: string
}

export default function Block({ children, className = "", ...props }: BlockProps) {
    return <div
        className={`Block ${className} cdx-block`}
        {...props}>
        {children}
    </div>
}
