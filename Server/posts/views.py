from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from django.conf import settings
import jwt
import json
from mongoengine import *



# CONNECT TO MONGO-DB


connect(
    db=settings.MONGO_DBNAME,
    host=settings.MONGO_DB_URI  
)





@csrf_exempt
def create_post(request):

    if request.method == "POST":
        data = json.loads(request.body)
        print("request hit.....")

        try:

            username = data.get('username')
            user_email = data.get('user_email')
            caption = data.get('caption')
            image = data.get('image')
            location = data.get('location')
            tags = data.get('tags')

            print("username :- ", username)
            post = Post(username=username, user_email=user_email, caption=caption, image=image, location=location, tags=tags)
            post.save()

            ulikes= UserLikes(postId=post.id, likes=[])
            ulikes.save()

            return JsonResponse({"message": "post created successfully", "status":"200"})

        except:
            return JsonResponse({"message": "Error creating post", "status":"400"})
    
    else:
        return JsonResponse({"message": "Invalid request method", "status":"400"})
    
    



def get_posts(request):
    if request.method == "GET":
        try:
            posts = Post.objects.order_by('-createdAt')
            posts_lists = json.loads(posts.to_json())
            
            return JsonResponse({'posts':posts_lists})
        
        except:
            return JsonResponse({"message": "Error getting posts", "status":"400"})
    else:
        return JsonResponse({"message": "Invalid request method", "status":"400"})



def get_post_by_username(request):
    if request.method == "GET":
        username=request.GET.dict()["username"]
        posts = Post.objects(username=username).order_by("-createdAt")  
        posts_lists = json.loads(posts.to_json())
        
        return JsonResponse({'posts':posts_lists})





@csrf_exempt
def delete_post(request, id):
    if request.method == "DELETE":
        try:
            post = Post.objects(id = id)
            post.delete()

            ulikes = UserLikes(postId=id)
            ulikes.delete()

            return JsonResponse({"message": "POST deleted successfully",'status':'200'})
        except:
            return JsonResponse({"message": "Error deleting post", "status":"400"})
    
    else:
        return JsonResponse({"message": "Invalid request method", "status":"400"})





@csrf_exempt
def savePost(request):
    if request.method == "POST":
        data = json.loads(request.body)

        try:
            

            username = data['username']
            user_email = data["post"]['user_email']
            caption = data["post"]['caption']
            image = data["post"]['image']
            location = data["post"]['location']
            tags = data["post"]['tags']
            id = data['post']['_id']

            print(data["post"]["username"], username, user_email, caption, location, tags, id)

            post = SavePost(username=username, user_email=user_email, caption=caption, image=image, location=location, tags=tags, postId=id)
            post.save()

            return JsonResponse({"message": "post saved successfully", "status":"200"})

        except:
            return JsonResponse({"message": "Error saving post", "status":"400"})
    
    else:
        return JsonResponse({"message": "Invalid request method", "status":"400"})




def CheckSavePost(request):
    if request.method=="GET":
        data=request.GET.dict()
        
        try:
            SavePost.objects.get(postId=data["postId"], username=data["username"])

            return JsonResponse({"Success":True})
        except:
            return JsonResponse({"Success":False})
        
    else:
        return JsonResponse({"message": "Invalid request method", "status":"400"})




def getSavedPost(request):
    if request.method=="GET":

        try:
        
            token=request.GET.dict()['token']
            # byte_token=token.encode('utf-8')
            username=jwt.decode(token,settings.JWT_SECRET_KEY, algorithms=["HS256"])['username']
            
            posts=SavePost.objects(username=username)
            posts_lists= json.loads(posts.to_json())
            
            return JsonResponse({'message': 'True','posts':posts_lists}, status=200)
        
        except:
            return JsonResponse({"message": "Error getting saved posts", "status":"400"})
        
    else:
        return JsonResponse({"message": "Invalid request method", "status":"400"})



@csrf_exempt
def delSavedPost(request):
    if request.method=="DELETE":

        try:
            data=request.GET.dict()
            
            post=SavePost.objects.filter(postId=data["postId"], username=data["username"])
            post.delete()

            return JsonResponse({'message': 'Post Deleted'}, status=200)

        except:
            return JsonResponse({"message": "Error deleting saved post", "status":"400"})
        
    else:
        return JsonResponse({"message": "Invalid request method", "status":"400"})





def getLikes(request,id):
    if request.method=="GET":
        try:

            data=UserLikes.objects(postId=id).first()
            print("likes :- ", data.likes)

            return JsonResponse({"success":True,"likesArr":data.likes})

        except:
            return JsonResponse({"success":False,"Message":"Data Not Found"})
        
    else:
        return JsonResponse({"message": "Invalid request method", "status":"400"})



@csrf_exempt
def updateLikes(request):
    if request.method=="POST":
        try:

            data=json.loads(request.body)

            postId=data.get("id")
            likesArr=data.get("likesArr")

            UserLikes.objects(postId=postId).update_one(set__likes=likesArr)


            return JsonResponse({"Success":True,"Message":"Data Updated"})

        except:
            return JsonResponse({"success":False,"Message":"Data Not Found"})
        
    else:
        return JsonResponse({"message": "Invalid request method", "status":"400"})


