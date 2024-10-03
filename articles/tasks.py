from typing import TYPE_CHECKING

from django_q.tasks import Schedule, schedule

if TYPE_CHECKING:
    from articles.models import Article


def publish_article(instance_id: str) -> None:
    from articles.models import Article, Status

    article = Article.objects.get(id=instance_id)
    article.status = Status.PUBLISHED
    article.save()


def schedule_article(instance: "Article") -> None:
    from articles.models import Status

    instance.status = Status.SCHEDULED

    schedule(
        "trekhunt.tasks.publish_article",
        instance.id,
        next_run=instance.published_at,
        schedule_type=Schedule.ONCE,
    )
