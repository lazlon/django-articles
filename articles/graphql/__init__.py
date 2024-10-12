import graphene

from articles.graphql.articles import ArticleQuery
from articles.graphql.photos import PhotoQuery
from articles.graphql.tags import TagQuery


class ArticlesQuery(PhotoQuery, ArticleQuery, TagQuery, graphene.ObjectType):
    pass
