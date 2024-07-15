import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { INewPost, INewUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

import {
  createUser,
  getCurrentUser,
  signInUser,
  signOutUser,
  createPost,
  getRecentPosts,
  deletePost,
  savePost,
  deleteSavedPost,
  getSavedPosts,
  updateLikes,
  getUserByUsername,
  getPostByUsername,
  getUserBySearch,
  followUser,
  unfollowUser,
} from "../server_apis/apis";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUser(user),
  });
};

export const useSignInUser = () => {
  return useMutation({
    mutationFn: (user: { username: string; password: string }) =>
      signInUser(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutUser,
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetUserByUsername = (username: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_USERNAME, username],
    queryFn: () => getUserByUsername(username),
  });
};

export const useGetUserBySearch = (value: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_SEARCH, value],
    queryFn: () => getUserBySearch(value),
    enabled: !!value,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useGetPostByUsername = (username: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_USERNAME],
    queryFn: () => getPostByUsername(username),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: any) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: any) => savePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: any) => deleteSavedPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
    },
  });
};

export const useGetSavedPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
    queryFn: getSavedPosts,
  });
};

export const useUpdateLikes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: any) => updateLikes(post.id, post.likesArr),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => followUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_USER_BY_USERNAME],
        });
    },
  });
};

export const useUnFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => unfollowUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_USER_BY_USERNAME],
        });
    },
  });
};
