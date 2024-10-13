import graphene
from graphene_django import DjangoObjectType

from articles.graphql import ArticlesQuery
from testapp.models import Article


class ArticleType(DjangoObjectType):
    class Meta:
        model = Article
        fields = "__all__"


class Query(ArticlesQuery, graphene.ObjectType):
    pass
