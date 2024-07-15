import { useDeletePost, useGetCurrentUser } from "@/lib/react-query/query";
import PostStats from "./PostStats";
import Loader from "@/components/shared/Loader";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

type PostCardProps = {
  post?: any;
};

const PostCard = ({ post }: PostCardProps) => {
  const { data: currentUser } = useGetCurrentUser();
  const { mutateAsync: delPost, isPending: isDeletingPost } = useDeletePost();

  function TimeAgo(dateObject: any) {
    // Convert the date object to a Date object

    const date = new Date(dateObject.$date);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  const deletePost = async () => {
    await delPost(post);
  };

  return (
    <>
      {post && (
        <div className="post-card mt-4">
          <div className="flex-between">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${post.username}`}>
                <img
                  className="rounded-full w-12 lg:h-12"
                  src={
                    post?.creator?.Image_url ||
                    `/assets/icons/profile-placeholder.svg`
                  }
                  alt=""
                />
              </Link>
              <Link to={`/profile/${post.username}`}>
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    @{post.username}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {post && TimeAgo(post.createdAt)}
                    </p>
                    ---
                    <p className="text-light-3 subtle-semibold lg:small-regular">
                      {post.location}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            {post.postId === undefined ? (
              <>
                {currentUser?.user.username === post.username ? (
                  <p>
                    {isDeletingPost ? (
                      <div className="flex-center">
                        <Loader />
                      </div>
                    ) : (
                      <img
                        src={`/assets/icons/delete.svg`}
                        onClick={() => deletePost()}
                        alt="Del"
                      />
                    )}
                  </p>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>

          <div className="small-medium lg:base-medium py-5">
            <p>{post.caption}</p>
          </div>

          <img src={post.image} className="post-card_img" alt="" />

          <PostStats post={post} />
        </div>
      )}
    </>
  );
};

export default PostCard;
