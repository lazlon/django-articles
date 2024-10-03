from django.contrib import admin
from django.urls import include, path

from articles.photoapi import photoapi

urlpatterns = [
    path("admin/", admin.site.urls),
    path("articles/", include("articles.urls")),
    path("articles/photoapi/", photoapi),
]
