import { createSignal, For, onMount } from "solid-js"
import { Loader, Search, Upload, X } from "lucide-solid"
import { Button } from "../components"
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
  onSelected,
  searchPhoto,
  selectFile,
  uploadPhoto,
  ref,
}: PhotoSelectorDialogProps) {
  let dialog: HTMLDialogElement
  let debounceTimeout: number
  const [photos, setPhotos] = createStore<Array<PhotoItem>>([])
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal("")

  onMount(() => ref(dialog))

  function close() {
    onSelected(null)
  }

  function onSearch(text: string) {
    clearTimeout(debounceTimeout)

    debounceTimeout = setTimeout(async () => {
      setLoading(true)
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
    }
    setLoading(false)
  }

  async function toggleSelection(photo: Photo) {
    const i = photos.findIndex(({ id }) => id === photo.id)
    if (i >= 0) setPhotos(i, "selected", !photos[i].selected)
  }

  return (
    <dialog
      class="m-auto bg-bg rounded-2xl p-3 shadow-2xl"
      ref={(el) => (dialog = el)}
      onClose={close}
    >
      <nav class="flex">
        <span class="text-2xl font-bold">Photos</span>
        <div class="flex items-center transition text-fg bg-fg/10 rounded-xl text-lg p-1 has-[input:focus]:bg-fg/18 placeholder:text-fg/50">
          <Search size={16} />
          <input
            class="outline-0"
            type="search"
            placeholder="Search"
            onInput={(e) => onSearch(e.target.value)}
          />
        </div>
        <div class="flex flex-1">
          {loading() && <Loader />}
          {photos.length > 0 ? (
            <Button onClick={() => onSelected(unwrap(photos))}>Select</Button>
          ) : (
            <Button onClick={close}>
              <X size={16} />
            </Button>
          )}
        </div>
      </nav>
      {error() ? (
        <div>{error()}</div>
      ) : (
        <div>
          <Button onClick={upload}>
            <div>
              <Upload />
              <span>Upload Image</span>
            </div>
          </Button>
          <For each={photos}>
            {(photo) => (
              <img
                src={photo.url}
                onclick={() => toggleSelection(photo)}
                classList={{ selected: photo.selected }}
              />
            )}
          </For>
        </div>
      )}
    </dialog>
  )
}
