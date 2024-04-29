from djongo import models
from mongoengine import *

class UserPeople(Document):
    username=StringField(required=True,primary_key=True)
    follower=DictField(max_length=1000000)
    following=DictField(max_length=1000000)





