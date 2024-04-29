from rest_framework import serializers
from .models import Posts,SavePost
from datetime import datetime


class PostsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Posts
        fields = '__all__'





class SavedSerialiser(serializers.ModelSerializer):
    class Meta:
        model = SavePost
        fields = '__all__'