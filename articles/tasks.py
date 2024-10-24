import contextlib
from typing import TYPE_CHECKING

from django.utils import timezone
from django_q.models import Schedule
from django_q.tasks import schedule

if TYPE_CHECKING:
    from articles.models import Article


def publish_article(instance_id: str) -> None:
    from articles.models import Article, Status

    with contextlib.suppress(Article.DoesNotExist):
        article = Article.objects.get(id=instance_id)
        article.status = Status.PUBLISHED
        article.save()


def _schedule(instance: "Article") -> None:
    from articles.models import Status

    instance.status = Status.SCHEDULED
    schedule(
        "trekhunt.tasks.publish_article",
        instance.id,
        name=instance.id,
        next_run=instance.published_at,
        schedule_type=Schedule.ONCE,
    )


def _unschedule(instance: "Article") -> None:
    from articles.models import Status

    with contextlib.suppress(Schedule.DoesNotExist):
        Schedule.objects.get(name=instance.id).delete()
        instance.status = Status.DRAFT
        instance.published_at = None


def schedule_article(instance: "Article") -> None:
    from articles.models import Status

    match instance.status:
        case Status.PUBLISHED:
            if instance.published_at is None:
                instance.published_at = timezone.now()

        case Status.DRAFT:
            if instance.published_at is not None:
                _schedule(instance)
            else:
                _unschedule(instance)

        case Status.SCHEDULED:
            s = Schedule.objects.get(name=instance.id)
            s.next_run = instance.published_at
