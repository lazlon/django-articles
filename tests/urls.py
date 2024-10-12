import graphene
from django.contrib import admin
from django.http import HttpRequest, JsonResponse
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

from articles.graphql import ArticlesQuery
from articles.lib.photo import upload_photo


def photo_upload(request: HttpRequest) -> JsonResponse:
    p = upload_photo(request)
    return JsonResponse({"id": p.id, "src": p.url})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("articles/", include("articles.urls")),
    path("articles/photo/upload/", photo_upload),
    path(
        "graphql/",
        csrf_exempt(
            GraphQLView.as_view(
                graphiql=True,
                schema=graphene.Schema(
                    query=ArticlesQuery,
                    # mutation=Mutation,
                ),
            ),
        ),
    ),
]
