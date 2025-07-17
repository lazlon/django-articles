from django.contrib import admin

from articles.forms import ArticleForm, AuthorForm, TagForm
from articles.models import Article, ArticleTag, Author, Document, Photo, Section, Tag


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    pass


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    search_fields = ["caption", "url"]
    list_display = ["caption", "url"]


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    form = AuthorForm


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    form = TagForm
    search_fields = ["name", "slug"]
    list_display = ["name", "slug", "locale"]


class SectionInline(admin.TabularInline):
    model = Section
    extra = 0
    ordering = ["order"]


class TagInline(admin.TabularInline):
    model = ArticleTag
    extra = 0
    ordering = ["order"]


# TODO: consider removing the registration here
# and allow consumers to register it instead if they want
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    form = ArticleForm

    inlines = [SectionInline, TagInline]
    list_display = ["title", "status", "updated_at", "published_at", "locale"]
    search_fields = ["title", "updated_at", "created_at", "published_at", "slug"]
    list_filter = ["status", "locale", "tags"]

    blacklisted_fields: list[str] = []

    fieldsets = [
        (
            None,
            {
                "fields": [
                    "title",
                    "id",
                    "slug",
                    "locale",
                    "author",
                    "visibility",
                    "subtitle",
                    "published_at",
                    "featured",
                    "feature_image",
                    "excerpt",
                ],
            },
        ),
        (
            "Meta Information",
            {
                "fields": [
                    "meta_title",
                    "meta_description",
                    "og_title",
                    "og_image",
                    "og_description",
                    "twitter_title",
                    "twitter_image",
                    "twitter_description",
                ],
                "classes": ["collapse"],
            },
        ),
        (
            "Code Injection",
            {
                "fields": ["code_injection_head", "code_injection_foot"],
                "classes": ["collapse"],
            },
        ),
    ]
