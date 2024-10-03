import "./SearchEntry.css"
import Icon from "./Icon"

type SearchEntryProps = {
    placeholder?: string
    onSearch(text: string): void
    setup?(self: HTMLInputElement): void
}

export default function SearchEntry({
    placeholder = "Search",
    onSearch,
    setup,
}: SearchEntryProps) {
    let input: HTMLInputElement

    return <div className="Search">
        <Icon icon="search" />
        <input
            setup={self => {
                input = self
                setup?.(self)
            }}
            type="search"
            placeholder={placeholder}
            oninput={() => void onSearch(input.value)}
        />
    </div>
}
