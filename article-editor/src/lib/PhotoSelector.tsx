/* eslint-disable @stylistic/indent */
import "./PhotoSelector.css"
import { State } from "@/jsx"
import { Icon, Button, SearchEntry } from "@/components"
import { searchPhoto, selectFile, uploadPhoto } from "./photo"

type Photo = { id: string, url: string }

const PHOTO_LIMIT = 19
const DEBOUNCE = 500

export default class PhotoSelector {
    constructor(private limit: number, private source: HTMLElement) { }

    private debounce!: number
    private selectResolve!: (photos: Array<Photo> | null) => void

    private selected = new State<Array<Photo>>([])
    private loading = new State(false)
    private error = new State("")
    private photos = new State<Array<Photo>>([])

    private async onSearch(text: string) {
        if (text == "")
            return

        this.loading.set(true)
        clearTimeout(this.debounce)
        this.debounce = setTimeout(async () => {
            const arr = await searchPhoto(this.source)(text)
            this.photos.set(arr.slice(0, PHOTO_LIMIT))
            this.loading.set(false)
        }, DEBOUNCE)
    }

    private onSelect() {
        document.body.removeChild(this.dialog)
        this.selectResolve(this.selected.get())
    }

    private async uploadImage() {
        const file = await selectFile()
        if (!file)
            return

        this.loading.set(true)
        try {
            const photo = await uploadPhoto(this.source)(file)

            if (photo.error) {
                return this.error.set(`Server error: ${photo.error}`)
            }

            this.photos.set([
                { id: photo.id!, url: photo.url! },
                ...this.photos.get().slice(0, PHOTO_LIMIT - 1),
            ])

            this.toggleSelection(this.photos.get()[0])
            // editPhoto(photo)
        }
        catch (error) {
            console.error(error)
            this.error.set("Server Error")
        }
        this.loading.set(false)
    }

    private toggleSelection(photo: Photo) {
        const selection = this.selected.get()

        // clicked selected -> remove
        if (selection.find(s => s.id === photo.id)) {
            return this.selected.set(selection.filter(s => s.id !== photo.id))
        }

        // selected and already full -> shift array
        if (selection.length === this.limit) {
            return this.selected.set([photo, ...selection.slice(0, -1)])
        }

        this.selected.set([photo, ...selection])
    }

    private close() {
        document.body.removeChild(this.dialog)
        this.selectResolve(null)
    }

    private dialog = <dialog className="PhotoSelector" onclose={this.close.bind(this)}>
        <nav>
            <span className="title">Photos</span>
            <SearchEntry onSearch={this.onSearch.bind(this)} />
            <div style={{ display: "flex", flex: "1" }}>
                {this.loading(l => l && <Icon icon="loader" />)}
                {this.selected(s => s.length > 0
                    ? <Button className="primary" onclick={this.onSelect.bind(this)}>
                        Select
                    </Button>
                    : <Button className="close" onclick={this.close.bind(this)}>
                        <Icon icon="x" />
                    </Button>)}
            </div>
        </nav>
        {this.error(err => err
            ? <div className="error">{err}</div>
            : <div className="body">
                <Button className="upload" onclick={this.uploadImage.bind(this)}>
                    <div>
                        <Icon icon="upload" />
                        <span>Upload Image</span>
                    </div>
                </Button>
                {this.photos(ps => ps.map(p => (
                    <img
                        src={p.url}
                        onclick={() => this.toggleSelection(p)}
                        className={this.selected(s =>
                            s.some(({ id }) => p.id === id) ? "selected" : "")
                        }
                    />
                )))}
            </div>)}
    </dialog> as HTMLDialogElement

    select(): Promise<Array<Photo> | null> {
        document.body.append(this.dialog)
        this.dialog.showModal()
        return new Promise(resolve => {
            this.selectResolve = resolve
        })
    }
}
