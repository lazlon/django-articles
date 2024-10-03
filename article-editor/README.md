# Article Editor

Built with [Editor.js](https://editorjs.io/)

## Usage

```html
<article-editor photoapi="http://mysite.com/api/photo/">
  <h2>Heading</h2>
  <p>initial content</p>
</article-editor>

<script>
  const editor = document.querySelector("article-editor")
  editor.addEventListener("input", () => {
    console.log(editor.content)
  })
</script>
```

## Photo API endpoint

```py
def photo(req: HttpRequest) -> JsonResponse:
    if q := req.GET.get("q"):
        photos = get_photos() # should be limited to <= 19
        return JsonResponse([{"id": p.id, "src": p.url} for p in photos])

    if get := req.GET.get("get"):
        photo = get_photo_by_id(get)
        return JsonResponse({"url": photo.url}, safe=False)

    if req.GET.get("upload"):
        photo = upload_image(request.FILES["image"])
        return JsonResponse({"id": photo.id, "src": photo.url})

    return JsonResponse({"error": "unknown parameters"})
```
