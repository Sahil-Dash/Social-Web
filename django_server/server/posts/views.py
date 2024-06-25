from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from .serialiser import PostsSerializer,SavedSerialiser
from .models import *
from django.conf import settings
import jwt
from mongoengine import *



connect(
    db='Snapgram_DB', 
    host='mongodb://localhost:27017/',  
)



@api_view(['GET'])
def get_posts(request):
    post = Posts.objects.order_by("-" + "createdAt")  
    serializer = PostsSerializer(post , many=True) 
    
    return Response({'posts':serializer.data})


@api_view(['GET'])
def get_post_by_username(request):
    username=request.GET.dict()["username"]
    post = Posts.objects.filter(username=username).order_by("-" + "createdAt")  
    serializer = PostsSerializer(post , many=True) 
    
    return Response({'posts':serializer.data})


@api_view(['POST'])
def create_post(request):
    data = request.data
    data.setdefault("createdAt",str(datetime.today()))

    serializer = PostsSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()

        likes=UserLikes(postId=serializer.data["id"],likes=[])
        likes.save()

   
        return Response({'message':' Post created sucessfully', 'status':'200','payload':serializer.data})

    return Response({'message':'invalid post data','status':'404 NOT FOUND','errors':serializer.errors})  
    


@api_view(['DELETE'])
def delete_post(request, id):
    try:
        post = Posts.objects.get(id = id)
    except Posts.DoesNotExist:
        return Response({"message": "POST not found",'status':'404 NOT FOUND'})
    post.delete()
    return Response({"message": "POST deleted successfully",'status':'200'})







@api_view(["POST"])
def savePost(request):
    data=request.data

    data["post"].setdefault("postId",int(data["post"]["id"]))
    del data["post"]["id"]

    data["post"]["createdAt"]=str(datetime.today())
    data["post"]["username"]=data["username"]

    serialiser=SavedSerialiser(data=data["post"])

    if serialiser.is_valid():
        serialiser.save()
        return Response({"Success":True,"message":"Saved successfully","Status":200,"data":data})



    return Response({"Success":False,"message":"Invalid Data","data":data,"error":serialiser.errors})



@api_view(["GET"])
def CheckSavePost(request):
    data=request.GET.dict()
    
    print(data)
    try:
        SavePost.objects.get(postId=data["postId"], username=data["username"])
        return Response({"Success":True})
    except:
        return Response({"Success":False})



@api_view(['GET'])
def getSavedPost(request):
        
    token=request.GET.dict()['token']
    # byte_token=token.encode('utf-8')
    username=jwt.decode(token,settings.JWT_SECRET_KEY, algorithms=["HS256"])['username']
    
    data=SavePost.objects.filter(username=username)
    serialiser=SavedSerialiser(data, many=True)
    

    return Response({'message': 'True','posts':serialiser.data}, status=200)



@api_view(['DELETE'])
def delSavedPost(request):

    data=request.GET.dict()
    print(data)
    
    post=SavePost.objects.filter(postId=data["postId"], username=data["username"])
    post.delete()

    return Response({'message': 'Post Deleted'}, status=200)




@api_view(['GET'])
def getLikes(request,id):

    data=UserLikes.objects(postId=id)
    for i in data:
        likes=i.likes

    return Response({"success":True,"likesArr":likes})



@api_view(["POST"])
def updateLikes(request):

    data=request.data

    postId=data["id"]
    likesArr=data["likesArr"]
    print(postId,likesArr)

    UserLikes.objects(postId=postId).update_one(set__likes=likesArr)


    return Response({"Success":True,"Message":"Data Updated"})


