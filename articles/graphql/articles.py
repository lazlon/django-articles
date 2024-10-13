import graphene
from graphene_django import DjangoObjectType

from articles import models
from articles.lib.article import filter_article, search_article


class Article(DjangoObjectType):
    class Meta:
        model = models.Article
        fields = "__all__"


class ArticleQuery(graphene.ObjectType):
    article_by_id = graphene.Field(Article, id=graphene.String())

    article_by_slug = graphene.Field(
        Article,
        locale=graphene.String(),
        slug=graphene.String(),
    )

    search_articles = graphene.List(
        Article,
        keyword=graphene.String(),
        locale=graphene.String(),
        limit=graphene.Int(required=False),
    )

    articles = graphene.List(
        Article,
        locale=graphene.String(),
        limit=graphene.Int(required=False),
        featured=graphene.Boolean(required=False),
        tags=graphene.List(graphene.String, required=False),
        page=graphene.Int(required=False),
        drafts=graphene.Boolean(required=False),
    )

    def resolve_article_by_id(self, _, id: str):  # noqa: A002, ANN001, ANN201
        return models.Article.objects.get(id=id)

    def resolve_article_by_slug(self, _, locale: str, slug: str):  # noqa: ANN001, ANN201
        return models.Article.objects.get(slug=slug, locale=locale)

    def resolve_search_articles(self, _, keyword: str, locale: str, limit: int = 20):  # noqa: ANN001, ANN201
        return search_article(keyword, locale, limit)

    def resolve_articles(  # noqa: ANN201, PLR0913
        self,
        _: graphene.ResolveInfo,
        locale: str,
        limit: int = 20,
        featured: bool | None = None,
        tags: list[str] = [],  # noqa: B006
        page: int = 1,
        drafts: bool = False,  # noqa: FBT001, FBT002
    ):
        return filter_article(locale, limit, featured, tags, page, drafts)
