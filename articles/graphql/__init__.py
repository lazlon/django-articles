import graphene

from articles.graphql.articles import ArticleQuery
from articles.graphql.author import AuthorQuery
from articles.graphql.photos import PhotoQuery
from articles.graphql.sections import SectionQuery
from articles.graphql.tags import TagQuery


class ArticlesQuery(
    ArticleQuery,
    SectionQuery,
    AuthorQuery,
    PhotoQuery,
    TagQuery,
    graphene.ObjectType,
): ...
