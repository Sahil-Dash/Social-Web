import { useDeletePost, useGetCurrentUser } from "@/lib/react-query/query"
import PostStats from "./PostStats"
import Loader from "@/components/shared/Loader"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"




type PostCardProps = {
    post?: any
}



const PostCard = ({ post }: PostCardProps) => {

    const { data: currentUser } = useGetCurrentUser()
    const { mutateAsync: delPost, isPending: isDeletingPost } = useDeletePost()




    function getRelativeTime(timestamp: string) {
        // Get the current time
        const now:any = new Date();

        // Convert the timestamp to a Date object
        const then:any = new Date(timestamp);

        // Calculate the difference in milliseconds
        const delta = now - then;

        // Define thresholds in milliseconds
        const oneMinute = 60 * 1000;
        const oneHour = oneMinute * 60;
        const oneDay = oneHour * 24;

        // Create the output string based on the difference
        if (delta < oneMinute) {
            return "just now";
        } else if (delta < oneHour) {
            const minutes = Math.round(delta / oneMinute);
            return `${minutes} minutes ago`;
        } else if (delta < oneDay) {
            const hours = Math.round(delta / oneHour);
            return `${hours} hours ago`;
        } else {
            // Adjust for day offset if needed (consider timezones)
            const days = Math.round(delta / oneDay);
            return `${days} days ago`;
        }
    }




    const deletePost = async () => {

        await delPost(post)
    }


    return (
        <div className='post-card mt-4'>
            <div className='flex-between'>

                <div className='flex items-center gap-3'>
                    <Link to={`/profile/${post.username}`}>

                        <img className='rounded-full w-12 lg:h-12'
                            src={post?.creator?.Image_url || `/assets/icons/profile-placeholder.svg`} alt="" />
                        </Link>
                        <Link to={`/profile/${post.username}`}>

                            <div className='flex flex-col'>
                                <p className='base-medium lg:body-bold text-light-1'>
                                    @{post.username}
                                </p>
                                <div className='flex-center gap-2 text-light-3'>
                                    <p className='subtle-semibold lg:small-regular'>
                                        {getRelativeTime(post.createdAt)}
                                    </p>
                                    ---
                                    <p className='text-light-3 subtle-semibold lg:small-regular'>
                                        {post.location}
                                    </p>
                                </div>

                            </div>
                        </Link>

                </div>
                {(post.postId === undefined) ?
                    <>{(currentUser?.user.username === post.username)
                        ? <p>
                            {isDeletingPost ? (
                                <div className="flex-center">
                                    <Loader />
                                </div>
                            ) : <img src={`/assets/icons/delete.svg`} onClick={() => deletePost()} alt="Del" />}
                        </p>
                        : ""}</>
                    : ""}




            </div>

            <div className='small-medium lg:base-medium py-5'>
                <p>
                    {post.caption}
                </p>

            </div>

            <img src={post.image} className='post-card_img' alt="" />

            <PostStats post={post} />

        </div>
    )
}

export default PostCard
