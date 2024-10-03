# django-articles

## Quick start

0. Build the article-editor project

```sh
cd article-editor
npm install
npm run build
```

1. Add "articles" app to your INSTALLED_APPS setting

```python
# settings.py
INSTALLED_APPS = [
    "articles"
]
```

2. Add the articles urls

```python
# urls.py
from django.urls import include, path

urlpatterns = [
    path("articles/", include("articles.urls")),
]
```

3. Create the photo API endpoint

```python
# urls.py
def photoapi(req: HttpRequest) -> JsonResponse:
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

urlpatterns = [
    path("articles/photoapi/", photoapi)
]
```

Or you can use the default one that uses local files

```python
# urls.py
from articles.photoapi import photoapi

urlpatterns = [
    path("articles/photoapi", photoapi),
]
```

4. Add django_q settings

```python
# settings.py
Q_CLUSTER = {
    "workers": 8,
    "recycle": 500,
    "timeout": 60,
    "compress": True,
    "cpu_affinity": 1,
    "save_limit": 250,
    "queue_limit": 500,
    "label": "Django Q",
    "name": "DjangORM",
    "orm": "default",  # Use Django's ORM + database for broker
}
```

## Settings

Locales are configurable through `ARTICLE_LOCALES`

```python
# settings.py
ARTICLE_LOCALES = [
    ("EN", "English"),
    ("HU", "Hungarian"),
]
```

Preview and Liveview urls of the articles

```python
# settings.py
ARTICLE_PREVIEW = "https://mysite.com/{locale}/preview/{slug}"
ARTICLE_LIVEVIEW = "https://mysite.com/{locale}/article/{slug}"
```

## Usage

Define an Article model

```python
from articles.api import AbstractArticle
from articles.models import Photo

class Article(AbstractArticle):
    extra_field = m.CharField(max_length=255, blank=True, null=True)
    extra_photo = m.ForeignKey(Photo, m.CASCADE, blank=True, null=True)
```

Register it in the admin

```python
from django.contrib import admin

from articles.api import AbstractArticleAdmin, ArticleForm
from articles.forms import PhotoField
from myapp.models import Article


class CustomArticleForm(ArticleForm):
    custom_photo = PhotoField()


@admin.register(Article)
class ArticleAdmin(AbstractArticleAdmin):
    form = CustomArticleForm

    class Meta:
        model = Article

    fieldsets = [
        (
            "Extra Fields",
            {
                "fields": [
                    "extra_field",
                    "extra_photo",
                ],
            },
        ),
    ]
```
