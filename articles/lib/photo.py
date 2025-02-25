import tempfile
from pathlib import Path
from typing import Callable, cast

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from django.http import HttpRequest
from django.utils import timezone
from PIL import Image
from thefuzz.fuzz import partial_ratio

from articles.models import Photo

tmp = tempfile.gettempdir() + "/"

MIN_SCORE = 70


def search_photo(search: str, limit: int = 20) -> list[Photo]:
    photos = Photo.objects.all()
    limit = 19
    if search == "":
        return [*photos.order_by("-updated_at")[0:limit]]

    def score(p: Photo) -> int:
        return partial_ratio(search.lower().replace("/", " "), p.id.replace("/", " ").lower())

    data = [(p, score(p)) for p in photos]
    filtered = [i for i in data if i[1] > MIN_SCORE]
    matches = sorted(filtered, key=lambda i: i[1], reverse=True)
    return [m[0] for m in matches[0:limit]]


def upload_photo(request: HttpRequest, name: Callable[[str], str] | None = None) -> Photo:
    file = request.FILES["photo"]
    date = timezone.now()

    path = Path(settings.MEDIA_ROOT)
    if not path.exists():
        path.mkdir(parents=True)

    if isinstance(file, InMemoryUploadedFile):
        img = Image.open(tmp + FileSystemStorage(location=tmp).save(file.name, file))
    elif isinstance(file, TemporaryUploadedFile):
        img = Image.open(file.temporary_file_path())
    else:
        raise Exception("wrong file format")  # noqa: EM101, TRY002, TRY003, TRY004

    filename = f"{'.'.join(cast(str, file.name).split('.')[:-1])}"
    if callable(name):
        filename = name(filename)
    img.save(f"{settings.MEDIA_ROOT}/{filename}.webp", "webp")

    leading_slash = "/" if not str(settings.MEDIA_URL).startswith("/") else ""

    return Photo.objects.create(
        id=f"{date.year}/{date.month}/{filename}",
        url=f"{leading_slash}{settings.MEDIA_URL}{filename}.webp",
        height=img.height,
        width=img.width,
    )
