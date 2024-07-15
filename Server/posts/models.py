from mongoengine import Document, StringField, EmailField, DateTimeField, ListField,IntField,SequenceField

from django.utils import timezone



class Post(Document):
    id= SequenceField(primary_key=True)
    username = StringField(required=True, max_length=50)
    user_email = EmailField(required=True)
    caption = StringField(max_length=500)
    image = StringField(required=True, max_length=100000000)
    location = StringField(max_length=100)
    tags = StringField(max_length=50)
    createdAt = DateTimeField(default=timezone.now)


class UserLikes(Document):
    postId=IntField(primary_key=True,required=True)
    likes=ListField(max_length=100000)



class SavePost(Document):

    username = StringField(max_length=100)
    user_email = StringField(max_length=100)
    caption = StringField(max_length=1000)
    image = StringField(max_length=100000000000000)
    location = StringField(max_length=100)
    tags = StringField(max_length=100)
    createdAt = DateTimeField(default=timezone.now)
    postId=IntField(required = True)