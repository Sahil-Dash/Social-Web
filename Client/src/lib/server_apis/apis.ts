import { INewUser } from "@/types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_SERVER_URL + "api/";

// USER AUTHENTICATION

export async function createUser(user: INewUser) {
  try {
    const res = await axios.post<{ message: string; token: any }>(
      BASE_URL + "create-user/",
      user
    );

    if (res.status == 200) {
      localStorage.setItem("token", res.data.token);
      return { msg: res.data.message, status: res.status };
    } else {
      return { msg: res.data.message, status: res.status };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function signInUser(user: { username: string; password: string }) {
  try {
    const res = await axios.post<{
      message: string;
      status: number;
      token: any;
    }>(BASE_URL + "login-user/", user);
    console.log(res);

    if (res.data.status == 200) {
      localStorage.setItem("token", res.data.token);
      return { msg: res.data.message, status: res.data.status };
    } else {
      return { msg: res.data.message, status: res.data.status };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function signOutUser() {
  try {
    localStorage.clear();
    return { status: "200" };
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const auth_token = localStorage.getItem("token");
    let data = { token: auth_token };
    const res = await axios.get<{ user: any }>(BASE_URL + "get-current-user/", {
      params: data,
    });

    return { user: res.data.user };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserByUsername(username: string) {
  try {
    let data = { username: username };
    const res = await axios.get<{ user: any }>(
      BASE_URL + "get-user-by-username/",
      { params: data }
    );
    console.log("user", res.data);
    return res.data.user;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserBySearch(value: string) {
  try {
    let data = { value: value };
    const res = await axios.get<{ users: any }>(
      BASE_URL + "get-user-by-search/",
      { params: data }
    );
    console.log(res.data);
    return res.data.users;
  } catch (error) {
    console.log(error);
  }
}

// USER POSTS

export async function createPost(post: any) {
  try {
    // post.likes=[{}]
    console.log("post :- ", post);
    const res = await axios.post(BASE_URL + "create-post/", post);
    console.log(res.data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const res = await axios.get<{ posts: any }>(BASE_URL + "get-recent-posts/");
    console.log(res.data);
    return res.data.posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostByUsername(username: string) {
  try {
    let data = { username: username };
    const res = await axios.get<{ posts: any }>(
      BASE_URL + "get-posts-by-username/",
      { params: data }
    );
    console.log(res.data);
    return res.data.posts;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: any) {
  try {
    console.log(postId._id);

    const res = await axios.delete<{ post: any }>(
      BASE_URL + `delete-post/${postId._id}/`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

// SAVE POST

export async function savePost(post: any) {
  try {
    console.log("save post :- ", post);
    const data = {
      post: post.post,
      username: post.username,
    };
    console.log(data);

    const res = await axios.post(BASE_URL + "save-post/", data);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(post: any) {
  try {
    const res = await axios.delete(BASE_URL + "delete-saved-post/", {
      params: post,
    });
    console.log(res.data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function checkSavedPost(postData: any) {
  try {
    const data = {
      postId: postData.postId,
      username: postData.username,
    };

    console.log(data);

    const res = await axios.get(BASE_URL + `check-saved-post/`, {
      params: data,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSavedPosts() {
  try {
    const token = localStorage.getItem("token");
    let data = { token: token };
    const res = await axios.get<{ posts: any }>(BASE_URL + `get-saved-posts/`, {
      params: data,
    });
    console.log(res.data);

    return res.data.posts;
  } catch (error) {
    console.log(error);
  }
}

// LIKE POST

export async function getLikes(postId: any) {
  try {
    const res = await axios.get<{ likesArr: any }>(
      BASE_URL + `get-likes/${postId}/`
    );
    console.log(res.data.likesArr);

    return res.data.likesArr;
  } catch (error) {
    console.log(error);
  }
}

export async function updateLikes(postId: string, likesArr: any) {
  try {
    let data = {
      id: postId,
      likesArr: likesArr,
    };
    // console.log(data)

    const res = await axios.post(BASE_URL + `update-likes/`, data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function followUser(data: any) {
  try {
    const res = await axios.post(BASE_URL + `follow-user/`, data);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function unfollowUser(data: any) {
  try {
    const res = await axios.post(BASE_URL + `unfollow-user/`, data);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
