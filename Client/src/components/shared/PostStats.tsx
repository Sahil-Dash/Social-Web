import { useDeleteSavedPost, useGetCurrentUser, useSavePost, useUpdateLikes } from "@/lib/react-query/query"
import { useState, useEffect } from "react"
import Loader from "./Loader"
import { checkSavedPost, getLikes } from "@/lib/server_apis/apis"
import { useLocation } from "react-router-dom"

// import { userAtom } from "@/lib/recoilStateManager/currentUser"
// import { useRecoilValue } from "recoil"


type PostProps = {
    post: any,

}

const PostStats = ({ post }: PostProps) => {


    const [isSaved, setIsSaved] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const location = useLocation()

    const { mutateAsync: updateLikes, isPending: isUpdating } = useUpdateLikes()
    const { mutateAsync: savePost, isPending: isSaving } = useSavePost()
    const { mutateAsync: delSavedPost, isPending: isDeleting } = useDeleteSavedPost()
    const { data: currentUser } = useGetCurrentUser()


    useEffect(() => {

        console.log(location.pathname)

        const getPostLikes = async () => {
            let res = await getLikes((location.pathname === '/saved') ? post.postId : post.id)
            setLikeCount(res.length)
            if (res.includes(currentUser?.user.username)) {
                setIsLiked(true)
            }
        }

        const check = async () => {

            let res = await checkSavedPost({
                postId: (location.pathname === '/saved') ? post.postId : post.id
                , username: currentUser?.user.username
            })
            setIsSaved(res.Success)
        }
        check()
        getPostLikes()



    }, [])

    const handleSavePost = async (e: React.MouseEvent) => {
        e.stopPropagation();

        let savedPost = await checkSavedPost({
            postId: (location.pathname === '/saved') ? post.postId : post.id,
            username: currentUser?.user.username
        })

        if (savedPost.Success) {
            setIsSaved(false)
            let username = currentUser?.user.username
            let postData = { postId: (location.pathname === '/saved') ? post.postId : post.id, username: username }
            await delSavedPost(postData)

        }
        else {
            setIsSaved(true)
            let postData = { post: post, username: currentUser?.user.username }
            await savePost(postData)
        }
    }


    const handleLikePost = async (e: React.MouseEvent) => {
        e.stopPropagation();
        let likesArr = await getLikes((location.pathname === '/saved') ? post.postId : post.id)


        let hasLiked = likesArr.includes(currentUser?.user.username)
        console.log(hasLiked,currentUser?.user.username)


        if (hasLiked) {
            setIsLiked(false)

            likesArr = likesArr.filter((user: string) => user !== currentUser?.user.username)
            setLikeCount(likesArr.length)
            let data = { likesArr: likesArr, id: post.id }
            updateLikes(data)


        }
        else {
            setIsLiked(true)

            likesArr.push(currentUser?.user.username)
            setLikeCount(likesArr.length)
            let data = { likesArr: likesArr, id: post.id }
            updateLikes(data)
        }
    }




    return (
        <div className='flex justify-between items-center z-20'>
            <div className='flex gap-2 mr-5'>
                {post.postId ? ""
                    : <>{<img src={isLiked
                        ? "/assets/icons/liked.svg"
                        : "/assets/icons/like.svg"
                    }
                        className='cursor-pointer'
                        width={20}
                        height={20}
                        alt="like"
                        onClick={handleLikePost}
                    />}

                        <p>{likeCount}</p>

                    </>}



            </div>

            <div className='flex gap-2 '>
                {isSaving || isDeleting ? <Loader /> : <img src={isSaved
                    ? "/assets/icons/saved.svg"
                    : "/assets/icons/save.svg"
                }
                    className='cursor-pointer'
                    width={20}
                    height={20}
                    alt="save"
                    onClick={handleSavePost}
                />}


            </div>

        </div>
    )
}

export default PostStats
