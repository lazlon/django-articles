import graphene
from django.db.models import QuerySet
from graphene_django import DjangoObjectType

from articles.graphql.sections import SectionType
from articles.lib.article import filter_article, search_article
from articles.models import Article


class ArticleType(DjangoObjectType):
    class Meta:
        model = Article
        fields = "__all__"


class ArticleQuery(graphene.ObjectType):
    sections = graphene.List(SectionType)
    article_by_id = graphene.Field(ArticleType, id=graphene.String())

    article_by_slug = graphene.Field(
        ArticleType,
        locale=graphene.String(),
        slug=graphene.String(),
    )

    search_article = graphene.List(
        ArticleType,
        keyword=graphene.String(),
        locale=graphene.String(),
        limit=graphene.Int(required=False),
    )

    articles = graphene.List(
        ArticleType,
        locale=graphene.String(),
        limit=graphene.Int(required=False),
        featured=graphene.Boolean(required=False),
        tags=graphene.List(graphene.String, required=False),
        page=graphene.Int(required=False),
        drafts=graphene.Boolean(required=False),
    )

    def resolve_article_by_id(self, _, id: str) -> Article | None:  # noqa: A002, ANN001
        return Article.objects.get(id=id)

    def resolve_article_by_slug(self, _, locale: str, slug: str):  # noqa: ANN201, ANN001
        return Article.objects.get(slug=slug, locale=locale)

    def resolve_search_article(self, _, keyword: str, locale: str, limit: int = 20):  # noqa: ANN001, ANN201
        return search_article(keyword, locale, limit)

    def resolve_articles(  # noqa: PLR0913
        self,
        _: graphene.ResolveInfo,
        locale: str,
        limit: int = 20,
        featured: bool | None = None,
        tags: list[str] = [],  # noqa: B006
        page: int = 1,
        drafts: bool = False,  # noqa: FBT001, FBT002
    ) -> QuerySet[Article]:
        return filter_article(locale, limit, featured, tags, page, drafts)
