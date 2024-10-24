from django.contrib import admin

from articles.api import AbstractArticleAdmin, ArticleForm
from articles.forms import PhotoField
from testapp.models import Article


class CustomArticleForm(ArticleForm):
    custom_photo = PhotoField()

    class Meta:
        model = Article
        exclude = []


@admin.register(Article)
class ArticleAdmin(AbstractArticleAdmin):
    form = CustomArticleForm
    form.Meta.model = Article

    fieldsets = [
        (
            "Widgets",
            {
                "fields": [
                    "show_ads",
                    "show_your_ad_here",
                    "show_login_widget",
                    "show_fb_widget",
                    "weather_location_name",
                    "szallas_hu_feed",
                    "custom_photo",
                    "foreign",
                ],
            },
        ),
    ]
