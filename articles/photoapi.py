from django.http.request import HttpRequest
from django.http.response import JsonResponse


# TODO: default photoapi impl using local files
def photoapi(req: HttpRequest) -> JsonResponse:
    if q := req.GET.get("q"):  # noqa: F841
        # photos = get_photos() # should be limited to <= 19
        return JsonResponse([{"id": "", "src": ""}], safe=False)

    if get := req.GET.get("get"):  # noqa: F841
        # photo = get_photo_by_id(get)
        return JsonResponse({"url": ""}, safe=False)

    if req.GET.get("upload"):
        # photo = upload_image(request.FILES["image"])
        return JsonResponse({"id": "", "src": ""})

    return JsonResponse({"error": "unknown parameters"})
