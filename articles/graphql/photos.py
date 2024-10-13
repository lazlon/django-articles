from typing import cast

import graphene
from graphene_django import DjangoObjectType

from articles.lib.photo import search_photo
from articles.models import Photo


class PhotoType(DjangoObjectType):
    class Meta:
        model = Photo
        fields = "__all__"

    src = graphene.NonNull(graphene.String)

    def resolve_src(self, _):  # noqa: ANN001, ANN201
        return cast(Photo, self).url


class PhotoQuery(graphene.ObjectType):
    photos = graphene.NonNull(
        graphene.List(graphene.NonNull(PhotoType)),
        limit=graphene.Int(),
        search=graphene.String(required=False),
    )

    photo_by_id = graphene.Field(
        PhotoType,
        id=graphene.String(),
    )

    def resolve_photos(self, _, limit: int, search=""):  # noqa: ANN201, ANN001
        if search == "":
            return Photo.objects.all()

        return search_photo(search, limit)

    def resolve_photo_by_id(self, _, id: str) -> Photo:  # noqa: ANN001, A002
        return Photo.objects.get(id=id)
