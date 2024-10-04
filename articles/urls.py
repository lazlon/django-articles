from django.conf import settings
from django.contrib import messages
from django.http.request import HttpRequest
from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect
from django.urls import path, reverse
from django.utils import timezone

from articles.models import Article, Photo, Status


def preview(_: HttpRequest, locale: str, slug: str) -> HttpResponseRedirect:
    preview_url = getattr(settings, "ARTICLE_PREVIEW", None)
    if preview_url is None:
        pk = Article.objects.get(slug=slug, locale=locale).id
        return HttpResponseRedirect(f"/admin/articles/article/{pk}/change/")

    return HttpResponseRedirect(preview_url.format(slug=slug, locale=locale))


def liveview(_: HttpRequest, locale: str, slug: str) -> HttpResponseRedirect:
    liveview_url = getattr(settings, "ARTICLE_LIVEVIEW", None)
    if liveview_url is None:
        pk = Article.objects.get(slug=slug, locale=locale).id
        return HttpResponseRedirect(f"/admin/articles/article/{pk}/change/")

    return HttpResponseRedirect(liveview_url.format(slug=slug, locale=locale))


def publish(request: HttpRequest, pk: str) -> HttpResponseRedirect:
    article = Article.objects.get(pk=pk)
    article.status = Status.PUBLISHED
    article.published_at = timezone.now().today()
    article.save()
    messages.success(request, f"{article.title} has been published")
    return redirect(reverse("admin:index"))


def photo_search(request: HttpRequest) -> JsonResponse:
    if q := request.GET.get("q"):
        photos = Photo.search(q)
        return JsonResponse([{"id": p.id, "url": p.url} for p in photos], safe=False)

    return JsonResponse([], safe=False)


def photo_get(request: HttpRequest) -> JsonResponse:
    photo = Photo.objects.get(pk=request.GET.get("get"))
    return JsonResponse({"url": photo.url}, safe=False)


urlpatterns = [
    path("preview/<str:locale>/<str:slug>/", preview),
    path("live/<str:locale>/<str:slug>/", liveview),
    path("publish/<str:pk>/", publish),
    path("photo/get/", photo_get),
    path("photo/search/", photo_search),
]
