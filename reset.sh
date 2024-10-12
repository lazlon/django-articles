#!/bin/bash

rm -rf ./testapp/migrations
rm -rf ./articles//migrations
rm -rf ./db.sqlite3

./manage.py makemigrations articles
./manage.py makemigrations testapp
./manage.py migrate

./manage.py shell <<END
from django.contrib.auth.models import User
user = User.objects.create_superuser('admin', '', 'admin')

from articles.models import Author
Author.objects.create(
    user=user,
    name="Author",
    slug="author",
)
END

./manage.py runserver
