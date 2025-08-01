# Generated by Django 5.1.1 on 2025-07-17 18:40

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('articles', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('show_ads', models.BooleanField(default=True)),
                ('show_your_ad_here', models.BooleanField(default=False)),
                ('show_login_widget', models.BooleanField(default=False)),
                ('show_fb_widget', models.BooleanField(default=False)),
                ('weather_location_name', models.CharField(blank=True, max_length=255, null=True)),
                ('szallas_hu_feed', models.CharField(blank=True, max_length=255, null=True)),
                ('article', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='articles.article')),
                ('custom_photo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='articles.photo')),
                ('foreign', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='test_foreign', to='testapp.article')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
