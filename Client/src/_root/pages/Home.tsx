// import Loader from '@/components/shared/Loader';
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/query";
import { useEffect, useState } from "react";

const Home = () => {
  const { data: posts } = useGetRecentPosts();
  const [post, setPost] = useState<any[]>([]);

  useEffect(() => {
    setPost(posts);
  }, [posts]);

  console.log(posts);

  return (
    <>
      {posts === undefined ? (
        <Loader />
      ) : (
        <div className="flex flex-1">
          <div className="home-container">
            <div className="home-posts">
              <h2 className="h3-bold text-center md:h2-boldtext-keft w-full">
                Home Feed
              </h2>
              {posts.length === 0 ? (
                <p className="h3-bold md: h3-boldtext text-center">
                  It seems you'r the first one to post here
                </p>
              ) : (
                ""
              )}
              {
                <ul>
                  {post &&
                    post.map((item) => <PostCard key={item.id} post={item} />)}
                </ul>
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
