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

3. Create the photo upload endpoint (optionally use provided one that uses local files)

```python
# urls.py
from articles.lib.photo import upload_photo

def photo_upload(request: HttpRequest) -> JsonResponse:
    p = upload_photo(request.FILES["photo"])
    return JsonResponse({"id": p.id, "src": p.url})

urlpatterns = [
    path("articles/photo/upload/", photo_upload)
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
from articles.fields import PhotoField

class Article(AbstractArticle):
    extra_field = m.CharField(max_length=255, blank=True, null=True)
    extra_photo = PhotoField()
```

Register it in the admin

```python
from django.contrib import admin

from articles.api import AbstractArticleAdmin, ArticleForm
from articles.forms import PhotoField
from myapp.models import Article


class CustomArticleForm(ArticleForm):
    custom_photo = PhotoField()

    class Meta:
        model = Article
        fields = []


@admin.register(Article)
class ArticleAdmin(AbstractArticleAdmin):
    form = CustomArticleForm

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
