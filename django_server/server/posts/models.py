from djongo import models
from mongoengine import *



class UserLikes(Document):
    postId=IntField(primary_key=True,required=True)
    likes=ListField(max_length=100000)





class Posts(models.Model):

    username = models.CharField(max_length=100)
    user_email = models.CharField(max_length=100)
    caption = models.CharField(max_length=1000)
    image = models.CharField(max_length=100000000)
    location = models.CharField(max_length=100)
    tags = models.CharField(max_length=100)
    createdAt = models.CharField(max_length=100)


class SavePost(models.Model):

    username = models.CharField(max_length=100)
    user_email = models.CharField(max_length=100)
    caption = models.CharField(max_length=1000)
    image = models.CharField(max_length=100000000000)
    location = models.CharField(max_length=100)
    tags = models.CharField(max_length=100)
    createdAt = models.CharField(max_length=100)
    postId=models.IntegerField()







