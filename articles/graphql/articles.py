from typing import cast

import graphene
from bs4 import BeautifulSoup
from graphene_django import DjangoObjectType

from articles import models
from articles.graphql.tags import TagType
from articles.lib.article import filter_article, search_article


class Article(DjangoObjectType):
    class Meta:
        model = models.Article
        fields = "__all__"

    primary_tag = graphene.Field(TagType)
    plain_excerpt = graphene.String()
    locale = graphene.NonNull(graphene.String)

    def resolve_primary_tag(self, _: graphene.ResolveInfo) -> models.Tag | None:
        return cast(models.Article, self).tags.filter(visibility=models.Visibility.PUBLIC).first()

    def resolve_plain_excerpt(self, _: graphene.ResolveInfo) -> str | None:
        a = cast(models.Article, self)
        return BeautifulSoup(a.excerpt, "html.parser").get_text() if a.excerpt is not None else None

    def resolve_locale(self, _: graphene.ResolveInfo) -> str:
        return cast(models.Article, self).locale


class ArticleQuery(graphene.ObjectType):
    article_count = graphene.NonNull(
        graphene.Int,
        locale=graphene.String(required=False),
        drafts=graphene.Boolean(required=False),
    )

    article_by_id = graphene.Field(
        Article,
        id=graphene.String(),
    )

    article_by_slug = graphene.Field(
        Article,
        locale=graphene.String(),
        slug=graphene.String(),
    )

    search_articles = graphene.NonNull(
        graphene.List(graphene.NonNull(Article)),
        keyword=graphene.String(),
        locale=graphene.String(),
        limit=graphene.Int(required=False),
    )

    articles = graphene.NonNull(
        graphene.List(graphene.NonNull(Article)),
        locale=graphene.String(required=False),
        limit=graphene.Int(required=False),
        featured=graphene.Boolean(required=False),
        tags=graphene.List(graphene.String, required=False),
        page=graphene.Int(required=False),
        drafts=graphene.Boolean(required=False),
    )

    def resolve_article_count(
        self,
        _: graphene.ResolveInfo,
        locale: str | None = None,
        drafts: bool = False,  # noqa: FBT001, FBT002
    ) -> int:
        articles = models.Article.objects.filter(visibility=models.Visibility.PUBLIC)
        if locale is not None:
            articles = articles.filter(locale=locale)
        if not drafts:
            articles = articles.filter(status=models.Status.PUBLISHED)
        return articles.count()

    def resolve_article_by_id(self, _: graphene.ResolveInfo, id: str) -> models.Article | None:  # noqa: A002
        return models.Article.objects.get(id=id)

    def resolve_article_by_slug(
        self,
        _: graphene.ResolveInfo,
        locale: str,
        slug: str,
    ) -> models.Article | None:
        return models.Article.objects.get(slug=slug, locale=locale)

    def resolve_search_articles(
        self,
        _: graphene.ResolveInfo,
        keyword: str,
        locale: str,
        limit: int = 20,
    ) -> list[models.Article]:
        return search_article(keyword, locale, limit)

    def resolve_articles(  # noqa: ANN201, PLR0913
        self,
        _: graphene.ResolveInfo,
        locale: str | None = None,
        limit: int = 20,
        featured: bool | None = None,
        tags: list[str] | None = None,
        page: int = 1,
        drafts: bool = False,  # noqa: FBT001, FBT002
    ):
        return filter_article(locale, limit, featured, tags, page, drafts)
