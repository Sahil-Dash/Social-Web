# Generated by Django 4.1.13 on 2024-04-25 05:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_student'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SavePost',
        ),
    ]