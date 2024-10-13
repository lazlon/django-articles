import graphene
from graphene_django import DjangoObjectType

from articles.models import Author


class AuthorType(DjangoObjectType):
    class Meta:
        model = Author
        fields = "__all__"


class AuthorQuery(graphene.ObjectType):
    authors = graphene.List(AuthorType)

    def resolve_authors(self, _):  # noqa: ANN201, ANN001
        return Author.objects.all()
