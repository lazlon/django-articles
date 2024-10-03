from django.conf import settings
from django.contrib import messages
from django.http.request import HttpRequest
from django.http.response import HttpResponseRedirect
from django.shortcuts import redirect
from django.urls import path, reverse
from django.utils import timezone

from articles.models import Article, Status


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


urlpatterns = [
    path("preview/<str:locale>/<str:slug>/", preview),
    path("live/<str:locale>/<str:slug>/", liveview),
    path("publish/<str:pk>/", publish),
]
