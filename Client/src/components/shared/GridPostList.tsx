
import { Link } from "react-router-dom";

import PostStats from "./PostStats";
// import { useGetRecentPosts } from "@/lib/react-query/query";
// import { useEffect, useState } from "react";
// import { getRecentPosts } from "@/lib/server_apis/apis";


type GridPostListProps = {
    posts?:any
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
    posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {

console.log("Posts :",posts)




    


  return (
    <ul className="grid-container">
      {posts.map((post:any) => (
        <li key={post.tags} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.id}`} className="grid-post_link">
            <img
              src={post.image}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.image ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.username}</p>
              </div>
            )}
            {showStats && <PostStats post={post}  />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;