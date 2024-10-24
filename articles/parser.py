import json
from datetime import datetime
from typing import TypedDict, cast

from django.utils import timezone
from django.utils.dateparse import parse_datetime

from articles.models import Article, ArticleTag, Author, Photo, Tag


class Section(TypedDict):
    order: int
    title: str
    content: str


class ArticleContent(TypedDict):
    excerpt: str
    sections: list[Section]


class Data(TypedDict):
    id: list[str]
    article_content: list[str]
    tags: list[str]
    title: list[str]
    slug: list[str]

    locale: list[str]
    author: list[str]
    subtitle: list[str]
    published_at_0: list[str]
    published_at_1: list[str]
    featured: list[str]
    feature_image: list[str]
    meta_title: list[str]
    meta_description: list[str]
    og_title: list[str]
    og_image: list[str]
    og_description: list[str]
    twitter_title: list[str]
    twitter_image: list[str]
    twitter_description: list[str]

    code_injection_head: list[str]
    code_injection_foot: list[str]


# I'm not a python dev, is there a better way to do this?
def parse(article: Article, indata: dict) -> str:
    data = cast(Data, indata)

    article.title = data["title"][0]
    article.slug = data["slug"][0]
    article.locale = data["locale"][0]
    article.author = Author.objects.get(pk=data["author"][0])
    article.subtitle = data["subtitle"][0]

    if data["published_at_0"][0] != "" and data["published_at_1"][0] != "":
        date = f"{data["published_at_0"][0]} {data["published_at_1"][0]}"
        article.published_at = timezone.make_aware(cast(datetime, parse_datetime(date)))

    article.featured = isinstance(data.get("featured"), list)

    article.feature_image = (
        Photo.objects.get(pk=data["feature_image"][0]) if data["feature_image"][0] != "" else None
    )

    article.meta_title = data["meta_title"][0]
    article.meta_description = data["meta_description"][0]
    article.og_title = data["og_title"][0]
    article.og_description = data["og_description"][0]

    article.og_image = (
        Photo.objects.get(pk=data["og_image"][0]) if data["og_image"][0] != "" else None
    )

    article.twitter_title = data["twitter_title"][0]
    article.twitter_description = data["twitter_description"][0]

    article.twitter_image = (
        Photo.objects.get(pk=data["twitter_image"][0]) if data["twitter_image"][0] != "" else None
    )

    article.code_injection_head = data["code_injection_head"][0]
    article.code_injection_foot = data["code_injection_foot"][0]

    article_content: ArticleContent = json.loads(data["article_content"][0])

    article.excerpt = article_content["excerpt"]

    # TODO: compare content instead of deleting
    article.sections.all().delete()

    for s in article_content["sections"]:
        article.sections.create(
            title=s["title"],
            content=s["content"],
            order=s["order"],
            created_at=timezone.now(),
        )

    ArticleTag.objects.filter(article=article).delete()
    tags: list[str] = json.loads(data["tags"][0])
    for i, pk in enumerate(tags):
        ArticleTag(
            tag=Tag.objects.get(pk=pk),
            article=article,
            order=i,
        ).save()

    return data["id"][0]
