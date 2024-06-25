from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
from bson import json_util
import jwt
from datetime import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serialiser import *
from .models import *

from pymongo import MongoClient


# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Replace with your connection string
db = client["Snapgram_DB"]  # Replace with your database name
user_collection = db["auth_user"]  # Replace with your collection name




# USER AUTH METHODS


@csrf_exempt
def createUser(request):

    if request.method == 'POST':

        data = json.loads(request.body)
        username=data.get('username')
        name = data.get('name')
        email = data.get('email')
        password=data.get('password')

        try:
            User.objects.get(username=username)
            return JsonResponse({'message': 'Username already exist'}, status=200)
        except:
            try:
                User.objects.get(email=email)
                return JsonResponse({'message': 'Email already exist'}, status=200)
            except:

                user=User(username=username,name=name,email=email)
                user.set_password(password)
                user.save()

                people=UserPeople(username=username,follower={},following={})
                people.save()

                token_data={"username":username}

                token=jwt.encode(token_data,settings.JWT_SECRET_KEY)
                # str_token=token.decode('utf-8')

                return JsonResponse({'message': 'sign-up successful','token':token},status=200)
            
            
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

@csrf_exempt
def loginUser(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        username=data.get('username')
        password=data.get('password')

        user = authenticate(request, username=username, password=password)

        if user != None:
            token_data={"username":username}

            token=jwt.encode(token_data,settings.JWT_SECRET_KEY)
            # str_token=token.decode('utf-8')

            return JsonResponse({'message': 'sign-in successful','token':token,"status":200})
        else:
            return JsonResponse({'message': 'sign-in not successful',"status":400})
            
            
            
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

def getCurrentUser(request):
    if request.method=='GET':
        token=request.GET.dict()['token']
        # byte_token=token.encode('utf-8')
        username=jwt.decode(token,settings.JWT_SECRET_KEY, algorithms=["HS256"])['username']
        
        user=list(User.objects.filter(username=username).values())
        user=user[0]
        
        people=UserPeople.objects(username=username)

        for i in people:
            user["following"]=i.following
            user["follower"]=i.follower

        return JsonResponse({'message': 'True','user':user}, status=200)


def getUserByUsername(request):
    if request.method=='GET':
        username=request.GET.dict()['username']
        
        user=list(User.objects.filter(username=username).values())
        user=user[0]
        
        people=UserPeople.objects(username=username)

        for i in people:
            user["following"]=i.following
            user["follower"]=i.follower



        return JsonResponse({'message': 'True','user':user}, status=200)


def getUserBySearch(request):
    if request.method=='GET':

        search_value=request.GET.dict()['value']

        query = {"username": {"$regex": ".*"+search_value+".*", "$options": "i"}}
        users = user_collection.find(query,{"username":1,"name":1,"_id":0})

        user_list=[user for user in users]

        return JsonResponse({'message': 'True','users':user_list}, status=200)
    


# USER-PEOPLE METHODS


def getPeople(request):
    if request.method=="GET":
        username=request.GET.dict()["username"]
        people=UserPeople.objects(username=username)

        data={}
        for i in people:
            data["username"]=i.username
            data["following"]=i.following
            data["follower"]=i.follower

        return JsonResponse({"people":data},safe=False)




@csrf_exempt
def followUser(request):
    if request.method=="POST":
        data = json.loads(request.body)
        following_username=data.get('following_username') 
        following_name=data.get('following_name')

        follower_username = data.get('follower_username')
        follower_name = data.get('follower_name')

        # For Following User
        for i in UserPeople.objects(username=following_username):
            following_following_dict=i.following
            following_follower_dict=i.follower

        following_following_dict[follower_username]={"name":follower_name, "username":follower_username}

        UserPeople(username=following_username,follower=following_follower_dict ,following=following_following_dict).save()


        # For Follower User
        for i in UserPeople.objects(username=follower_username):
            follower_follower_dict=i.follower
            follower_following_dict=i.following
        
        follower_follower_dict[following_username]={"name":following_name, "username":following_username}
        
        UserPeople(username=follower_username, following=follower_following_dict ,follower=follower_follower_dict).save()


        return JsonResponse({"success":True})



@csrf_exempt
def unFollowUser(request):
    if request.method=="POST":
        data = json.loads(request.body)
        following_username=data.get('following_username') 

        follower_username = data.get('follower_username')

        # For Following User
        for i in UserPeople.objects(username=following_username):
            following_dict=i.following
            follower_dict=i.follower
        del following_dict[follower_username]
        
        UserPeople(username=following_username, follower=follower_dict,following=following_dict).save()


        # For Follower User
        for i in UserPeople.objects(username=follower_username):
            follower_dict=i.follower
            following_dict=i.following
        
        del follower_dict[following_username]
        
        UserPeople(username=follower_username, following=following_dict,follower=follower_dict).save()


        return JsonResponse({"success":True})
