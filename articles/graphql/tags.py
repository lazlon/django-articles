from typing import cast

import graphene
from graphene_django import DjangoObjectType

from articles.models import Tag


class TagType(DjangoObjectType):
    class Meta:
        model = Tag
        fields = "__all__"

    article_count = graphene.NonNull(graphene.Int)
    locale = graphene.NonNull(graphene.String)

    def resolve_article_count(self, _) -> int:  # noqa: ANN001
        return cast(Tag, self).articles.count()

    def resolve_locale(self, _: graphene.ResolveInfo) -> str:
        return cast(Tag, self).locale


class TagQuery(graphene.ObjectType):
    tags = graphene.NonNull(
        graphene.List(graphene.NonNull(TagType)),
        locale=graphene.String(),
    )

    tag_by_slug = graphene.Field(
        TagType,
        locale=graphene.String(),
        slug=graphene.String(),
    )

    def resolve_tags(self, _, locale: str):  # noqa: ANN201, ANN001
        return Tag.objects.filter(locale=locale)

    def resolve_tag_by_slug(self, _, locale: str, slug: str):  # noqa: ANN201, ANN001
        return Tag.objects.get(locale=locale, slug=slug)
