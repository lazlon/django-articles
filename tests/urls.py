from django.contrib import admin
from django.http import HttpRequest, JsonResponse
from django.urls import include, path

from articles.lib.photo import upload_photo


def photo_upload(request: HttpRequest) -> JsonResponse:
    p = upload_photo(request)
    return JsonResponse({"id": p.id, "src": p.url})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("articles/", include("articles.urls")),
    path("articles/photo/upload/", photo_upload),
]
