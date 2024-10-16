import graphene
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpRequest, JsonResponse
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

from articles.lib.photo import upload_photo
from testapp.schema import Query


def photo_upload(request: HttpRequest) -> JsonResponse:
    try:
        p = upload_photo(request)
        return JsonResponse({"id": p.id, "url": p.url})
    except Exception as e:
        return JsonResponse({"error": str(e)})


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
                    query=Query,
                ),
            ),
        ),
    ),
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
]
