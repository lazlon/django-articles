"""
Fields used in models.py
"""

from django.conf import settings
from django.db import models as m

DEFAULT_ARTICLE_LOCALES = [
    ("EN", "EN"),
    ("HU", "HU"),
]


def _locale_choices() -> list:
    return getattr(
        settings,
        "ARTICLE_LOCALES",
        DEFAULT_ARTICLE_LOCALES,
    )


def PhotoField(related_name: str = "%(class)_photos") -> m.ForeignKey:  # noqa: N802
    from articles.models import Photo

    return m.ForeignKey(
        Photo,
        on_delete=m.DO_NOTHING,
        blank=True,
        null=True,
        related_name=related_name,
    )


def LocaleField(default: str = "EN") -> m.CharField:  # noqa: N802
    return m.CharField(
        max_length=7,
        choices=_locale_choices,
        default=default,
    )


def StatusField() -> m.CharField:  # noqa: N802
    from articles.models import Status

    return m.CharField(
        default=Status.DRAFT,
        choices=Status.choices,
        max_length=255,
    )
