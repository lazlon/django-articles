from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

ARTICLE_LOCALES = [
    ("en", "English"),
    ("hu", "Hungarian"),
    ("de", "German"),
]

Q_CLUSTER = {
    "workers": 8,
    "recycle": 500,
    "timeout": 60,
    "compress": True,
    "cpu_affinity": 1,
    "save_limit": 250,
    "queue_limit": 500,
    "label": "Django Q",
    "name": "DjangORM",
    "orm": "default",  # Use Django's ORM + database for broker
}

SECRET_KEY = "django-insecure-6melh(uq^4%)@=%3ve&bbm9o99gb$l#&uar%3ujvmozu=m9tw1"  # noqa: S105

DEBUG = True

INSTALLED_APPS = [
    "articles",
    "testapp",
    "django_q",
    "graphene_django",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "testapp.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    },
}


LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
STATIC_ROOT = "static/"
MEDIA_URL = "file/"
MEDIA_ROOT = BASE_DIR / "file/"
