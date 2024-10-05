import json
from uuid import uuid4

from django.conf import settings
from django.contrib import admin
from django.core.serializers import serialize
from django.db import models as m
from django.forms import ModelForm

from articles.fields import DEFAULT_ARTICLE_LOCALES
from articles.models import Article, Author, Tag
from articles.parser import parse


class AbstractArticle(m.Model):
    id = m.UUIDField(primary_key=True, default=uuid4)
    article = m.OneToOneField(Article, on_delete=m.CASCADE)

    class Meta:
        abstract = True


class ArticleForm(ModelForm):
    def __init__(self, *args, **kwargs) -> None:  # noqa: ANN002, ANN003
        super().__init__(*args, **kwargs)

        article_instance = getattr(
            self.instance,
            "article",
            Article(
                id=self.instance.id,
                title="Untitled",
                author=Author.objects.first(),
            ),
        )

        article = json.loads(serialize("json", [article_instance]))[0]
        article["tags"] = json.loads(serialize("json", article_instance.tags.all()))

        self.attributes = json.dumps(
            {
                "article": article,
                "tags": json.loads(serialize("json", Tag.objects.all())),
                "authors": json.loads(serialize("json", Author.objects.all())),
                "locales": getattr(
                    settings, "ARTICLE_LOCALES", DEFAULT_ARTICLE_LOCALES
                ),
            },
        )

    def save(self, commit: bool = True) -> AbstractArticle:  # noqa: ARG002, FBT001, FBT002
        instance: AbstractArticle = super().save(commit=False)
        article_instance = getattr(
            self.instance,
            "article",
            Article(
                id=self.instance.id,
                title="Untitled",
                author=Author.objects.first(),
            ),
        )

        formid = parse(article_instance, dict(self.data))
        article_instance.id = formid
        instance.id = formid
        article_instance.save()
        instance.article = article_instance
        instance.save()
        return instance


class AbstractArticleAdmin(admin.ModelAdmin):
    change_form_template = "articles/change_form.html"
    form = ArticleForm
