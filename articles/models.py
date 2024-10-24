from typing import TYPE_CHECKING
from uuid import uuid4

from django.contrib.auth.models import User
from django.db import models as m
from django.utils import timezone
from django.utils.text import slugify
from simple_history.models import HistoricalRecords

import articles.fields as f
from articles.tasks import schedule_article

if TYPE_CHECKING:
    from django.db.models.fields.related_descriptors import RelatedManager


class Visibility(m.TextChoices):
    INTERNAL = "INTERNAL"
    PUBLIC = "PUBLIC"


class Status(m.TextChoices):
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    PUBLISHED = "PUBLISHED"


class Photo(m.Model):
    id = m.CharField(primary_key=True, max_length=255)
    url = m.CharField(unique=True, max_length=255)
    alt = m.CharField(max_length=255, blank=True, null=True)
    caption = m.CharField(max_length=255, blank=True, null=True)
    user_uploaded = m.BooleanField(default=False)
    created_at = m.DateTimeField(auto_now_add=True)
    updated_at = m.DateTimeField(auto_now=True)
    height = m.IntegerField(default=0)
    width = m.IntegerField(default=0)

    def __str__(self) -> str:
        return str(self.caption or self.alt or self.id)

    @classmethod
    def search(cls, keyword: str, limit: int = 20) -> list["Photo"]:
        from articles.lib.photo import search_photo

        return search_photo(keyword, limit)


class Document(m.Model):
    title = m.CharField(max_length=100)
    file = m.FileField()
    uploaded_at = m.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return str(self.title)


class Author(m.Model):
    name = m.CharField(max_length=255)
    user = m.ForeignKey(User, m.DO_NOTHING, blank=True, null=True)
    slug = m.SlugField(primary_key=True, max_length=255, blank=True)
    active = m.BooleanField(default=False)
    profile_image = f.PhotoField(related_name="author_profile_images")
    cover_image = f.PhotoField(related_name="author_cover_images")

    def __str__(self) -> str:
        return str(self.name)

    def save(self, *args, **kwargs) -> None:  # noqa: ANN002, ANN003
        if not self.slug:
            self.slug = slugify(self.name)

        return super().save(*args, **kwargs)


class Tag(m.Model):
    id = m.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = m.CharField(max_length=255)
    slug = m.SlugField(max_length=255)
    locale = f.LocaleField()
    description = m.TextField(blank=True, null=True)
    visibility = m.CharField(default=Visibility.PUBLIC, choices=Visibility.choices, max_length=255)

    feature_image = f.PhotoField(related_name="tag_feature_images")
    feature_image_alt = m.CharField(max_length=255, blank=True, null=True)
    feature_image_caption = m.CharField(max_length=255, blank=True, null=True)

    og_image = f.PhotoField(related_name="tag_og_images")
    og_title = m.CharField(max_length=255, blank=True, null=True)
    og_description = m.TextField(blank=True, null=True)

    twitter_image = f.PhotoField(related_name="tag_twitter_images")
    twitter_title = m.CharField(max_length=255, blank=True, null=True)
    twitter_description = m.TextField(blank=True, null=True)

    meta_title = m.CharField(max_length=255, blank=True, null=True)
    meta_description = m.TextField(blank=True, null=True)
    code_injection_head = m.TextField(blank=True, null=True)
    code_injection_foot = m.TextField(blank=True, null=True)
    created_at = m.DateTimeField(auto_now_add=True)
    updated_at = m.DateTimeField(auto_now=True)

    articles = m.ManyToManyField("Article", blank=True, through="ArticleTag")

    def __str__(self) -> str:
        return str(self.name)


class Article(m.Model):
    id = m.UUIDField(primary_key=True, default=uuid4)
    slug = m.SlugField(max_length=255)
    title = m.CharField(max_length=255)
    subtitle = m.CharField(max_length=255, null=True, blank=True)
    locale = f.LocaleField()
    status = f.StatusField()
    created_at = m.DateTimeField(auto_now_add=True)
    updated_at = m.DateTimeField(auto_now=True)
    published_at = m.DateTimeField(blank=True, null=True)

    author = m.ForeignKey(Author, m.DO_NOTHING)
    excerpt = m.TextField(blank=True, null=True)
    code_injection_head = m.TextField(blank=True, null=True)
    code_injection_foot = m.TextField(blank=True, null=True)
    featured = m.BooleanField(default=False)

    feature_image = f.PhotoField(related_name="article_feature_images")

    og_image = f.PhotoField(related_name="article_og_images")
    og_title = m.CharField(max_length=255, blank=True, null=True)
    og_description = m.TextField(blank=True, null=True)

    twitter_image = f.PhotoField(related_name="article_twitter_images")
    twitter_title = m.CharField(max_length=255, blank=True, null=True)
    twitter_description = m.TextField(blank=True, null=True)

    meta_title = m.CharField(max_length=255, blank=True, null=True)
    meta_description = m.TextField(blank=True, null=True)

    history = HistoricalRecords(inherit=True)

    tags = m.ManyToManyField(Tag, blank=True, through="ArticleTag")
    sections: 'RelatedManager["Section"]'

    class Meta:
        unique_together = ("slug", "locale")

    def __str__(self) -> str:
        return str(self.title)

    def save(self, *args, **kwargs) -> None:  # noqa: ANN002, ANN003
        if self.slug is None or self.slug == "":
            self.slug = self.id

        self.updated_at = timezone.now()
        schedule_article(self)
        super().save(*args, **kwargs)


class ArticleTag(m.Model):
    article = m.ForeignKey(Article, on_delete=m.CASCADE)
    tag = m.ForeignKey(Tag, on_delete=m.CASCADE)
    order = m.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        unique_together = ("article", "tag")

    def __str__(self) -> str:
        return str(self.order)


class Section(m.Model):
    id = m.UUIDField(primary_key=True, default=uuid4, editable=False)
    article = m.ForeignKey(
        Article,
        m.CASCADE,
        blank=True,
        null=True,
        related_name="sections",
    )
    title = m.TextField(blank=True, null=True)
    content = m.TextField()
    order = m.IntegerField(default=0)
    created_at = m.DateTimeField(auto_now_add=True)
    updated_at = m.DateTimeField(auto_now=True)
    history = HistoricalRecords(inherit=True)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.article} -> {self.title}"

    def save(self, *args, **kwargs) -> None:  # noqa: ANN002, ANN003
        self.updated_at = timezone.now()
        super().save(*args, **kwargs)
