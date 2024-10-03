import contextlib
from collections.abc import Mapping

from django.forms import ModelChoiceField, ModelForm
from django.forms.widgets import Widget

from articles.models import Article, Author, Photo, Tag


class PhotoSelectorWidget(Widget):
    template_name = "widgets/photo_button.html"
    model = Photo

    def value_from_datadict(self, data: Mapping, files, name: str) -> Photo | None:  # noqa: ANN001, ARG002
        with contextlib.suppress(self.model.DoesNotExist):
            return self.model.objects.get(pk=data.get(name))


class PhotoField(ModelChoiceField):
    def __init__(self) -> None:
        super().__init__(
            queryset=Photo.objects.all(),
            widget=PhotoSelectorWidget(),
            required=False,
        )


class TagForm(ModelForm):
    feature_image = PhotoField()
    og_image = PhotoField()
    twitter_image = PhotoField()

    class Meta:
        model = Tag
        fields = "__all__"  # noqa: DJ007


class AuthorForm(ModelForm):
    profile_image = PhotoField()
    cover_image = PhotoField()

    class Meta:
        model = Author
        fields = "__all__"  # noqa: DJ007


class ArticleForm(ModelForm):
    feature_image = PhotoField()
    og_image = PhotoField()
    twitter_image = PhotoField()

    class Meta:
        model = Article
        fields = "__all__"  # noqa: DJ007
