from pathlib import Path
from typing import cast

import graphene
from bs4 import BeautifulSoup
from django.conf import settings
from django.utils.text import slugify
from graphene_django import DjangoObjectType

from articles.graphql.photos import PhotoType
from articles.models import Document, Photo, Section


class DocumentType(DjangoObjectType):
    class Meta:
        model = Document
        fields = "__all__"

    size = graphene.NonNull(graphene.Int)

    def resolve_size(self, _: graphene.ResolveInfo) -> int:
        file = str(cast(Document, self).file)
        path = Path(settings.BASE_DIR / file)
        return path.stat().st_size


class TocItemType(graphene.ObjectType):
    depth = graphene.NonNull(graphene.Int)
    title = graphene.NonNull(graphene.String)
    slug = graphene.NonNull(graphene.String)


class SectionType(DjangoObjectType):
    class Meta:
        model = Section
        fields = "__all__"

    photos = graphene.NonNull(graphene.List(graphene.NonNull(PhotoType)))
    documents = graphene.NonNull(graphene.List(graphene.NonNull(DocumentType)))
    plain_text_title = graphene.String()
    slug = graphene.NonNull(graphene.String)
    toc = graphene.NonNull(graphene.List(graphene.NonNull(TocItemType)))

    def resolve_photos(self, _):  # noqa: ANN201, ANN001
        soup = BeautifulSoup(cast(Section, self).content, "html.parser")
        photos = [p["id"] for p in soup.find_all("article-photo", recursive=True)]
        return Photo.objects.filter(id__in=photos)

    def resolve_documents(self, _):  # noqa: ANN001, ANN201
        soup = BeautifulSoup(cast(Section, self).content, "html.parser")
        files = [f["file"] for f in soup.find_all("file-card", recursive=True)]
        return Document.objects.filter(file__in=files)

    def resolve_plain_text_title(self, _) -> str:  # noqa: ANN001
        soup = BeautifulSoup(cast(Section, self).title, "html.parser")
        return soup.get_text()

    # add ids to headers for TOC
    def resolve_content(self, _) -> str:  # noqa: ANN001
        soup = BeautifulSoup(cast(Section, self).content, "html.parser")
        headers = soup.find_all(["h3", "h4", "h5", "h6"])
        for h in headers:
            h["id"] = slugify(h.get_text())
        return str(soup)

    def resolve_slug(self, _) -> str:  # noqa: ANN001
        title = SectionType.resolve_plain_text_title(self, None)
        return slugify(title)

    def resolve_toc(self, _) -> list[dict]:  # noqa: ANN001
        content = SectionType.resolve_content(self, None)
        title = SectionType.resolve_plain_text_title(self, None)

        soup = BeautifulSoup(content, "html.parser")
        headers = soup.find_all(["h2", "h3", "h4", "h5", "h6"])
        toc = [
            {
                "depth": int(h.name[1]) - 1,
                "title": h.get_text(),
                "slug": slugify(h.get_text()),
            }
            for h in headers
        ]

        return [{"depth": 1, "title": title, "slug": slugify(title)}, *toc]


class SectionQuery(graphene.ObjectType):
    sections = graphene.NonNull(graphene.List(graphene.NonNull(SectionType)))

    def resolve_sections(self, _):  # noqa: ANN001, ANN201
        return Section.objects.all()
