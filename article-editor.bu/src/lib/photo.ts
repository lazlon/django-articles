import PhotoSelector from "./PhotoSelector"

type Photo = { id: string, url: string }

function photoapi(elem: HTMLElement) {
    if (elem instanceof URL)
        return elem

    const path = typeof elem === "string"
        ? elem
        : elem.getAttribute("photoapi")

    if (!path)
        throw Error("missing photoapi")

    return path.startsWith("/")
        ? new URL(path, window.location.origin)
        : new URL(path)
}

function fullUrl(photo: string): string
function fullUrl(photo: Photo): Photo
function fullUrl(photo: Photo | string) {
    const url = typeof photo == "string" ? photo : photo.url
    const full = url.startsWith("/") ? window.origin + url : url
    return typeof photo === "string" ? full : { ...photo, url }
}

export function getPhotoUrl(elem: HTMLElement) {
    return async function (id: string) {
        if (!id) return ""

        const url = photoapi(elem)
        url.pathname += "/get"
        url.searchParams.set("get", id)
        const res = await fetch(url)
        const json = await res.json() as Photo
        return fullUrl(json.url)
    }
}

export function selectPhoto(elem: HTMLElement) {
    return function selectPhoto(limit: number) {
        return new PhotoSelector(limit, elem).select()
    }
}

export function selectFile(): Promise<File | null> {
    return new Promise(resolve => {
        const input = Object.assign(document.createElement("input"), {
            type: "file",
            accept: "image/*",
            onchange: () => {
                resolve(input.files?.[0] || null)
                document.body.removeChild(input)
            },
            oncancel: () => {
                resolve(null)
                document.body.removeChild(input)
            },
        })

        input.style.display = "none"
        document.body.appendChild(input)
        input.click()
    })
}

export function uploadPhoto(elem: HTMLElement) {
    return async function (file: File) {
        const token = document.querySelector<HTMLInputElement>(
            "input[type=hidden][name=csrfmiddlewaretoken]",
        )

        const form = new FormData()
        form.append("photo", file)

        if (token)
            form.append("csrfmiddlewaretoken", token.value)

        const url = photoapi(elem)
        url.pathname += "/upload/"

        const request = new Request(url, {
            method: "POST",
            body: form,
        })

        try {
            const res = await fetch(request)
            const photo = await res.json() as Photo & { error?: string }

            if (photo.error)
                return { error: photo.error }

            return {
                id: photo.id,
                url: fullUrl(photo.url),
            }
        }
        catch (error) {
            return error instanceof Error
                ? { error: error.message }
                : { error: error as string }
        }
    }
}

export function searchPhoto(elem: HTMLElement) {
    return async function (search: string) {
        const url = photoapi(elem)
        url.pathname += "/search"
        url.searchParams.set("q", search)
        const res = await fetch(url)
        const arr = await res.json() as Array<Photo>
        return arr.map(fullUrl)
    }
}
