# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-23 09:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0002_auto_20160323_0941'),
    ]

    operations = [
        migrations.CreateModel(
            name='FacebookPost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idPost', models.IntegerField(default=0)),
                ('likes', models.IntegerField(default=0)),
                ('shares', models.IntegerField(default=0)),
                ('countComment', models.IntegerField(default=0)),
            ],
        ),
        migrations.RemoveField(
            model_name='instagrampost',
            name='message',
        ),
        migrations.RemoveField(
            model_name='instagrampost',
            name='person',
        ),
        migrations.RemoveField(
            model_name='instagrampost',
            name='published',
        ),
        migrations.RemoveField(
            model_name='post',
            name='countComment',
        ),
        migrations.RemoveField(
            model_name='post',
            name='idPost',
        ),
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
        migrations.RemoveField(
            model_name='post',
            name='shares',
        ),
        migrations.RemoveField(
            model_name='twitterpost',
            name='message',
        ),
        migrations.RemoveField(
            model_name='twitterpost',
            name='person',
        ),
        migrations.RemoveField(
            model_name='twitterpost',
            name='published',
        ),
        migrations.AddField(
            model_name='instagrampost',
            name='post',
            field=models.OneToOneField(default=0, on_delete=django.db.models.deletion.CASCADE, to='polls.Post'),
        ),
        migrations.AddField(
            model_name='twitterpost',
            name='post',
            field=models.OneToOneField(default=0, on_delete=django.db.models.deletion.CASCADE, to='polls.Post'),
        ),
        migrations.AddField(
            model_name='facebookpost',
            name='post',
            field=models.OneToOneField(default=0, on_delete=django.db.models.deletion.CASCADE, to='polls.Post'),
        ),
    ]