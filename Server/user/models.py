from mongoengine import Document, StringField, EmailField, DateTimeField, DictField, SequenceField
from django.utils import timezone


class User(Document):
    id = SequenceField(primary_key=True)
    name = StringField(max_length=50, required=True)
    username = StringField(max_length=50, required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True, min_length=6)
    date_joined = DateTimeField(default=timezone.now)



class UserPeople(Document):
    name=StringField(required = True)
    username=StringField(required=True,primary_key=True)
    follower=DictField(max_length=1000000)
    following=DictField(max_length=1000000)