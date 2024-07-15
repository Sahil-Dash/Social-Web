from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.http import JsonResponse
from .models import *


from mongoengine import *
import jwt
import json





# CONNECT TO MONGO-DB


connect(
    db=settings.MONGO_DBNAME,
    host=settings.MONGO_DB_URI  
)

# connect(
#     db='Snapgram_DB', 
#     host='mongodb+srv://sahildash386:1nS0jmzMGy3OxXHw@cluster0.7ypmskq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',  
# )








def home(request):
    if request.method=="GET":
        return JsonResponse({"message": "successfull"})
    





# USER AUTH METHODS

@csrf_exempt
def createUser(request):

    if request.method == 'POST':

        data = json.loads(request.body)
        username=data.get('username')
        name = data.get('name')
        email = data.get('email')
        password=data.get('password')


        # Check if username already exists
        if User.objects(username=username).first() is not None:
            return JsonResponse({'error': 'Username already exists.'}, status=200)

        # Check if email already exists
        if User.objects(email=email).first() is not None:
            return JsonResponse({'error': 'Email already exists.'}, status=200)



        user=User(name=name, username=username, password=password, email=email)
        user.save()

        people=UserPeople(name=user.name, username=username,follower={},following={})
        people.save()

        token_data={"username":username}

        token=jwt.encode(token_data,settings.JWT_SECRET_KEY)
        print("Token :- ",token)

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

        user = User.objects(username=username).first()
 

        if user == None:
            return JsonResponse({'message': 'sign-in not successful, username does not exist',"status":400})

        elif user.password != password:
            return JsonResponse({'message': 'sign-in not successful, username and password doesnot match',"status":400})

        elif user != None:
            token_data={"username":username}

            token=jwt.encode(token_data,settings.JWT_SECRET_KEY)
            print("Token :- ",token)
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
        
        user=User.objects(username=username).only('username', 'email')
        json_user = json.loads( user.to_json())

        user=json_user[0]
        
        people=UserPeople.objects(username=username).first()

        user['following'] = people.following
        user['follower'] = people.follower

        return JsonResponse({'message': 'True','user':user}, status=200)


def getUserByUsername(request):
    if request.method=='GET':
        username=request.GET.dict()['username']
        
        user=User.objects(username=username).only('username', 'email','name')
        json_user = json.loads( user.to_json())

        user=json_user[0]
        
        people=UserPeople.objects(username=username)

        for i in people:
            user["following"]=i.following
            user["follower"]=i.follower



        return JsonResponse({'message': 'True','user':user}, status=200)


def getUserBySearch(request):
    if request.method=='GET':

        search_value=request.GET.dict()['value']

        users = User.objects(username__icontains=search_value)
        user_list = json.loads( users.to_json())

        return JsonResponse({'message': 'True','users':user_list}, status=200)
    


# # USER-PEOPLE METHODS




@csrf_exempt
def followUser(request):
    if request.method=="POST":
        data = json.loads(request.body)

        following_username=data.get('following_username') 
        following_name=data.get('following_name')

        follower_username = data.get('follower_username')
        follower_name = data.get('follower_name')


        # For Following User

        people=UserPeople.objects(username=following_username).first()
        following_following_dict=people.following
        following_follower_dict=people.follower

        following_following_dict[follower_username]={"name":follower_name, "username":follower_username}

        UserPeople(username=following_username,follower=following_follower_dict ,following=following_following_dict).save()


        # For Follower User

        people=UserPeople.objects(username=follower_username).first()
        follower_follower_dict=people.follower
        follower_following_dict=people.following
        
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

        people = UserPeople.objects(username=following_username).first()
        following_dict=people.following
        follower_dict=people.follower

        del following_dict[follower_username]
        
        UserPeople(username=following_username, follower=follower_dict,following=following_dict).save()


        # For Follower User

        people = UserPeople.objects(username=follower_username).first()
        follower_dict=people.follower
        following_dict=people.following
        
        del follower_dict[following_username]
        
        UserPeople(username=follower_username, following=following_dict,follower=follower_dict).save()


        return JsonResponse({"success":True})
