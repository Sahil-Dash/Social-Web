// import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useGetRecentPosts } from '@/lib/react-query/query';
import { useEffect, useState } from 'react';




const Home = () => {

  const { data: posts } = useGetRecentPosts()
  const [post, setPost] = useState<any[]>([])

  useEffect(()=>{
    setPost(posts)

  },[posts])

  


  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-boldtext-keft w-full'>
            Home Feed


          </h2>
          {
            <ul>
              {post && post.map((item) => (
                <PostCard key={item.id} post={item} />
                
              ))}

            </ul>
          }

        </div>

      </div>


    </div>
  )
}

export default Home
