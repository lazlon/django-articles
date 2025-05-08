import json
from uuid import uuid4

from django.conf import settings
from django.contrib import admin, messages
from django.core.serializers import serialize
from django.db import models as m
from django.forms import ModelForm
from django.http.request import HttpRequest

from articles.fields import DEFAULT_ARTICLE_LOCALES
from articles.models import Article, Author, Status, Tag
from articles.parser import parse


class AbstractArticle(m.Model):
    id = m.UUIDField(primary_key=True, default=uuid4)
    article = m.OneToOneField(Article, on_delete=m.CASCADE)

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return self.article.title


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
        article["tags"] = json.loads(
            serialize("json", article_instance.tags.all().order_by("articletag__order")),
        )

        self.attributes = json.dumps(
            {
                "article": article,
                "tags": json.loads(serialize("json", Tag.objects.all())),
                "authors": json.loads(serialize("json", Author.objects.all())),
                "locales": getattr(settings, "ARTICLE_LOCALES", DEFAULT_ARTICLE_LOCALES),
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

    actions = ["publish", "unpublish"]

    list_display = [
        "article_title",
        "article_status",
        "article_updated_at",
        "article_published_at",
        "article_locale",
    ]

    search_fields = [
        "article__title",
        "article__updated_at",
        "article__created_at",
        "article__published_at",
        "article__slug",
    ]

    list_filter = [
        "article__status",
        "article__locale",
        "article__tags",
    ]

    def article_title(self, obj: AbstractArticle) -> str:
        return obj.article.title

    def article_status(self, obj: AbstractArticle) -> str:
        return obj.article.status

    def article_updated_at(self, obj: AbstractArticle) -> str:
        return obj.article.updated_at.strftime("%b %d, %Y")

    def article_published_at(self, obj: AbstractArticle) -> str | None:
        if obj.article.published_at:
            return obj.article.published_at.strftime("%b %d, %Y")
        return None

    def article_locale(self, obj: AbstractArticle) -> str:
        return obj.article.locale

    def publish(self, request: HttpRequest, queryset: m.QuerySet[AbstractArticle]) -> None:
        count = 0
        for a in queryset.all():
            if a.article.status != Status.PUBLISHED:
                a.article.status = Status.PUBLISHED
                a.article.save()
                count += 1

        self.message_user(request, f"{queryset.count} articles(s) published.", messages.SUCCESS)

    def unpublish(self, request: HttpRequest, queryset: m.QuerySet[AbstractArticle]) -> None:
        count = 0
        for a in queryset.all():
            if a.article.status != Status.DRAFT:
                a.article.status = Status.DRAFT
                a.article.save()
                count += 1

        self.message_user(request, f"{count} articles(s) unpublished.", messages.SUCCESS)

    article_title.short_description = "Title"
    article_title.admin_order_field = "article__title"

    article_status.short_description = "Status"
    article_status.admin_order_field = "article__status"

    article_updated_at.short_description = "Updated At"
    article_updated_at.admin_order_field = "article__updated_at"

    article_published_at.short_description = "Published At"
    article_published_at.admin_order_field = "article__published_at"

    article_locale.short_description = "Locale"
    article_locale.admin_order_field = "article__locale"

    publish.short_description = "Publish selected articles"
    unpublish.short_description = "Unpublish selected articles"
