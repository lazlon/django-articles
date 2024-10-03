import PhotoSelector from "./PhotoSelector"

function photoapi(elem: HTMLElement | string) {
    const path = typeof elem === "string"
        ? elem
        : elem.getAttribute("photoapi")

    if (!path)
        throw Error("missing photoapi")

    return path.startsWith("/")
        ? new URL(path, window.location.origin)
        : new URL(path)
}

export function getPhotoUrl(elem: HTMLElement | string) {
    return async function photoUrl(id: string) {
        if (!id) return ""

        const url = new URL(photoapi(elem))
        url.searchParams.set("get", id)
        const res = await fetch(url)
        const json = await res.json() as { url: string }
        return json.url
    }
}

export function selectPhoto(elem: HTMLElement | string) {
    return function selectPhoto(limit: number) {
        return new PhotoSelector(limit, photoapi(elem)).select()
    }
}
