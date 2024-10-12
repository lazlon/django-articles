from graphene_django.fields import QuerySet
from thefuzz import fuzz

from articles.models import Article, Status

MIN_SCORE = 70

TITLE_WEIGHT = 1
TAG_WEIGHT = 0.7
SECTION_TITLE_WEIGHT = 0.5
SECTION_CONTENT_WEIGHT = 0.1

# number of words in search term to include content
INCLUDE_CONTENT = 3


def search_article(keyword: str, locale: str, limit: int = 20) -> list[Article]:
    search_term = keyword.lower()
    articles = (
        Article.objects.prefetch_related("sections")
        .prefetch_related("tags")
        .filter(locale=locale)
        .filter(status=Status.PUBLISHED)
    )

    def score(a: Article) -> float:
        scores = [0.0]

        title_score = fuzz.partial_ratio(search_term, a.title.lower())
        if title_score > MIN_SCORE:
            scores.append(title_score * TITLE_WEIGHT)

        for tag in a.tags.all():
            tag_score = fuzz.ratio(search_term, tag.name.lower())
            if tag_score > MIN_SCORE:
                scores.append(tag_score * TAG_WEIGHT)

        incl_content = len(search_term.split()) > INCLUDE_CONTENT
        for s in a.sections.all():
            stitle_score = fuzz.partial_ratio(search_term, s.plain_text_title.lower())
            if stitle_score > MIN_SCORE:
                scores.append(stitle_score * SECTION_TITLE_WEIGHT)

            if incl_content:
                scontent_score = fuzz.partial_token_sort_ratio(search_term, s.content.lower())
                if scontent_score > MIN_SCORE:
                    scores.append(scontent_score * SECTION_CONTENT_WEIGHT)

        return max(scores)

    data = [(a, score(a)) for a in articles]
    filtered = [i for i in data if i[1] > 0]
    matches = sorted(filtered, key=lambda i: i[1], reverse=True)
    return [m[0] for m in matches[0:limit]]


def filter_article(  # noqa: PLR0913
    locale: str,
    limit: int = 20,
    featured: bool | None = None,
    tags: list[str] = [],  # noqa: B006
    page: int = 1,
    drafts: bool = False,  # noqa: FBT001, FBT002
) -> QuerySet[Article]:
    query = Article.objects.filter(locale=locale)

    if not drafts:
        query = (
            query.filter(status=Status.PUBLISHED)
            .exclude(status=Status.DRAFT)
            .order_by("-published_at")
        )

    if featured is not None:
        query = query.filter(featured=featured)

    for tag in tags:
        if tag.startswith("-"):
            query = query.exclude(tags__slug=tag)
        else:
            query = query.filter(tags__slug=tag)

    if limit < 0:
        return query

    return query[((page - 1) * limit) : (page * limit)]
