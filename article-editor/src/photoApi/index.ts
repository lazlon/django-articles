import { render } from "solid-js/web"
import PhotoSelectorDialog from "./PhotoSelectorDialog"

type Photo = { id: string; url: string }

export type PhotoApi = {
  selectFiles: () => ReturnType<typeof selectFiles>
  getPhotoUrl: (id: string) => ReturnType<typeof getPhotoUrl>
  selectPhoto: (limit: number) => ReturnType<typeof selectPhoto>
  uploadPhoto: (file: File) => ReturnType<typeof uploadPhoto>
  searchPhoto: (text: string) => ReturnType<typeof searchPhoto>
}

export function getPhotoApiUrl(elem: HTMLElement) {
  let path = elem.getAttribute("photoapi")

  if (!path) throw Error("missing photoapi")
  if (!path.endsWith("/")) path += "/"

  return path.startsWith("/")
    ? new URL(path, window.location.origin)
    : new URL(path)
}

function fullUrl(url: string) {
  return url.startsWith("/") ? window.origin + url : url
}

export function selectFiles(): Promise<File[]> {
  return new Promise((resolve) => {
    const input = Object.assign(document.createElement("input"), {
      type: "file",
      accept: "image/*",
      multiple: true,
      onchange: () => {
        resolve([...(input.files ?? [])])
        document.body.removeChild(input)
      },
      oncancel: () => {
        resolve([])
        document.body.removeChild(input)
      },
    })

    input.style.display = "none"
    document.body.appendChild(input)
    input.click()
  })
}

export async function getPhotoUrl(api: URL, id: string): Promise<string> {
  if (!id) return ""
  const url = new URL(api + "get/")
  url.searchParams.set("get", id)
  const res = await fetch(url)
  const json = (await res.json()) as Photo
  return fullUrl(json.url)
}

export function selectPhoto(
  api: URL,
  limit: number,
): Promise<Array<Photo> | null> {
  return new Promise((resolve) => {
    const div = document.createElement("div")
    document.body.append(div)

    const remove = render(
      () =>
        PhotoSelectorDialog({
          limit,
          ref: (ref) => ref.showModal(),
          selectFiles,
          getPhotoUrl: (id) => getPhotoUrl(api, id),
          selectPhoto: (limit) => selectPhoto(api, limit),
          uploadPhoto: (file) => uploadPhoto(api, file),
          searchPhoto: (text) => searchPhoto(api, text),
          onSelected: (photos) => {
            document.body.removeChild(div)
            remove()
            resolve(photos)
          },
        }),
      div,
    )
  })
}

export async function uploadPhoto(api: URL, file: File) {
  const url = new URL(api + "upload/")
  const token = document.querySelector<HTMLInputElement>(
    "input[type=hidden][name=csrfmiddlewaretoken]",
  )

  const form = new FormData()
  form.append("photo", file)

  if (token) form.append("csrfmiddlewaretoken", token.value)

  try {
    const res = await fetch(url, {
      method: "POST",
      body: form,
    })

    const photo = (await res.json()) as Photo & { error?: string }
    if (photo.error) return { error: photo.error }

    return {
      id: photo.id,
      url: fullUrl(photo.url),
    }
  } catch (error) {
    return error instanceof Error
      ? { error: error.message }
      : { error: error as string }
  }
}

export async function searchPhoto(api: URL, search: string) {
  const url = new URL(api + "search/")
  url.searchParams.set("q", search)
  const res = await fetch(url)
  const arr = (await res.json()) as Array<Photo>
  return arr.map(({ id, url }) => ({ id, url: fullUrl(url) }))
}
