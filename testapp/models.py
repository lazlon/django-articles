import django.db.models as m

from articles.api import AbstractArticle
from articles.models import Photo


class Article(AbstractArticle):
    show_ads = m.BooleanField(default=True)
    show_your_ad_here = m.BooleanField(default=False)
    show_login_widget = m.BooleanField(default=False)
    show_fb_widget = m.BooleanField(default=False)

    custom_photo = m.ForeignKey(Photo, m.CASCADE, blank=True, null=True)

    weather_location_name = m.CharField(max_length=255, blank=True, null=True)
    szallas_hu_feed = m.CharField(max_length=255, blank=True, null=True)
    foreign = m.ForeignKey(
        "Article", m.DO_NOTHING, blank=True, null=True, related_name="test_foreign"
    )

    def __str__(self) -> str:
        return str(self.article.title)
