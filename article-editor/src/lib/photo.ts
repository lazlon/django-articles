import PhotoSelector from "./PhotoSelector"

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

export function getPhotoUrl(elem: HTMLElement) {
    return async function (id: string) {
        if (!id) return ""

        const url = photoapi(elem)
        url.pathname += "/get"
        url.searchParams.set("get", id)
        const res = await fetch(url)
        const json = await res.json() as { url: string }
        return json.url
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
        const form = new FormData()
        form.append("photo", file)

        const url = photoapi(elem)
        url.pathname += "/upload"

        const request = new Request(url, {
            method: "POST",
            body: form,
        })

        const res = await fetch(request)
        const photo = await res.json()

        return photo as {
            error?: string
            id: string
            url: string
        }
    }
}

export function searchPhoto(elem: HTMLElement) {
    return async function (search: string) {
        const url = photoapi(elem)
        url.pathname += "/search"
        url.searchParams.set("q", search)
        const res = await fetch(url)
        const arr = await res.json()
        return arr as Array<{ id: string, url: string }>
    }
}
