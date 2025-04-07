import { createSignal, For, onMount } from "solid-js"
import LoaderCircle from "lucide-solid/icons/loader-circle"
import Search from "lucide-solid/icons/search"
import Upload from "lucide-solid/icons/upload"
import X from "lucide-solid/icons/x"
import { Button } from "../editor/components"
import { type PhotoApi } from "./index"
import { createStore, unwrap } from "solid-js/store"

type Photo = { id: string; url: string }
type PhotoItem = Photo & { selected: boolean }

const PHOTO_LIMIT = 19
const DEBOUNCE = 500

type PhotoSelectorDialogProps = PhotoApi & {
  limit: number
  onSelected: (photos: Array<Photo> | null) => void
  ref: (dialog: HTMLDialogElement) => void
}

export default function PhotoSelectorDialog({
  limit,
  onSelected,
  searchPhoto,
  selectFile,
  uploadPhoto,
  ref,
}: PhotoSelectorDialogProps) {
  let dialog: HTMLDialogElement
  let content: HTMLDivElement
  let debounceTimeout: number
  const [photos, setPhotos] = createStore<Array<PhotoItem>>([])
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal("")

  onMount(() => {
    onSearch("")
    ref(dialog)
    searchPhoto("").then(console.log)
  })

  function close() {
    onSelected(null)
  }

  function select() {
    onSelected(unwrap(photos).filter((p) => p.selected))
  }

  function onSearch(text: string) {
    setLoading(true)
    clearTimeout(debounceTimeout)

    debounceTimeout = setTimeout(async () => {
      try {
        const photos = await searchPhoto(text)
        // TODO: compare each item saving their selected state
        setPhotos(
          photos.slice(0, PHOTO_LIMIT).map((p) => ({ ...p, selected: false })),
        )
      } catch (error) {
        setPhotos([])
        if (error instanceof Error) setError(error.message)
      }
      setLoading(false)
    }, DEBOUNCE)
  }

  async function upload() {
    setLoading(true)
    try {
      const file = await selectFile()
      if (!file) return

      const photo = await uploadPhoto(file)
      if (photo.error) {
        return setError(photo.error)
      }

      setPhotos(photos.length, { ...photo, selected: true })
    } catch (error) {
      if (error instanceof Error) setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function toggleSelection(photo: Photo) {
    const i = photos.findIndex(({ id }) => id === photo.id)
    const nSelected = photos.reduce(
      (count, photo) => count + (photo.selected ? 1 : 0),
      0,
    )

    if (i < 0) throw Error("selection out of range")

    if (limit === 1) {
      setPhotos([0, photos.length - 1], "selected", false)
      setPhotos(i, "selected", true)
    } else if (photos[i].selected) {
      setPhotos(i, "selected", false)
    } else if (nSelected < limit) {
      setPhotos(i, "selected", true)
    }
  }

  return (
    <dialog
      class="m-auto bg-bg rounded-xl shadow-2xl p-2 border-none"
      ref={(el) => (dialog = el)}
      onClose={close}
      onClick={(e) => {
        if (!content.contains(e.target)) onSelected(null)
      }}
    >
      <div class="p-3" ref={(div) => (content = div)}>
        <div class="grid grid-cols-3">
          <span class="text-2xl font-bold">Photos</span>
          <div class="flex items-center transition text-fg bg-fg/10 rounded-xl text-lg p-1 has-[input:focus]:bg-fg/18 placeholder:text-fg/50">
            {loading() ? (
              <LoaderCircle size={22} class="animate-spin" />
            ) : (
              <Search size={22} />
            )}
            <input
              class="outline-0 border-none bg-transparent"
              type="search"
              placeholder="Search"
              onInput={(e) => onSearch(e.target.value)}
            />
          </div>
          <div class="ml-auto self-start">
            {photos.filter((p) => p.selected).length > 0 ? (
              <Button
                class="flex bg-primary/50 hover:bg-primary/64"
                onClick={select}
              >
                <span class="mx-2 my-1">Select</span>
              </Button>
            ) : (
              <Button class="flex justify-center items-center" onClick={close}>
                <X size={18} class="my-1" />
              </Button>
            )}
          </div>
        </div>
        {error() && (
          <span class="mx-auto text-red-500 dark:text-red-300">{error()}</span>
        )}
        <div class="grid grid-cols-5 mt-4 gap-2">
          <Button class="size-32 flex" onClick={upload}>
            <div class="size-28 m-auto border border-dashed border-fg/48 flex flex-col justify-center items-center">
              <Upload size={58} class="mb-2" />
              <span>Upload Image</span>
            </div>
          </Button>
          <For each={photos}>
            {(photo) => (
              <img
                src={photo.url}
                onclick={() => toggleSelection(photo)}
                class={
                  "transition size-32 rounded-lg outline-2 " +
                  (photo.selected ? "outline-primary" : "outline-transparent")
                }
              />
            )}
          </For>
        </div>
      </div>
    </dialog>
  )
}
