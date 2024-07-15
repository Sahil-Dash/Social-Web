"""Server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from user.views import *
from posts.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),

    path('api/create-user/', createUser,name="createUser"),
    path('api/login-user/', loginUser,name="login"),
    path('api/get-current-user/', getCurrentUser,name="currentUser"),
    path('api/get-user-by-username/', getUserByUsername,name="userbyusername"),
    path('api/get-user-by-search/', getUserBySearch,name="userbysearch"),

    path('api/follow-user/', followUser,name="followuser"),
    path('api/unfollow-user/', unFollowUser,name="unfollowuser"),

    path('api/create-post/', create_post,name="create_post"),
    path('api/get-recent-posts/', get_posts,name="get-posts"),
    path('api/get-posts-by-username/', get_post_by_username,name="get-posts-by-username"),
    path('api/delete-post/<int:id>/', delete_post,name="delete_post"),


    path('api/save-post/', savePost,name="savePost"),
    path('api/check-saved-post/', CheckSavePost,name="check"),
    path('api/get-saved-posts/', getSavedPost,name="getsavedpost"),
    path('api/delete-saved-post/', delSavedPost,name="delsavedpost"),

    path('api/get-likes/<int:id>/', getLikes,name="get_likes"),
    path('api/update-likes/', updateLikes,name="update_likes"),
]
