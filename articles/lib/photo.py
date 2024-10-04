from thefuzz.fuzz import partial_ratio

from articles.models import Photo
from articles.urls import HttpRequest

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


# TODO: upload local files
def upload_photo(request: HttpRequest) -> Photo:
    pass
