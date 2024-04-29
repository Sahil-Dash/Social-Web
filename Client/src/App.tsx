import './globals.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Signin from './_auth/forms/Signin'
import Signup from './_auth/forms/Signup'
import Auth from './_auth/Auth'
import { Home, Explore, Saved, AllUsers, CreatePost, UpdatePost, Posts, Profile, UpdateProfile, LikedPosts } from './_root/pages'
import Root from './_root/Root'
import { Toaster } from "@/components/ui/toaster"
import { userAtom } from './lib/recoilStateManager/currentUser'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { useGetCurrentUser } from './lib/react-query/query'
import Followings from './_root/pages/Followings'
import Followers from './_root/pages/Followers'






const App = () => {

  const [user, setUser] = useRecoilState<any>(userAtom)
  const Navigate = useNavigate()

  const { data: currentUser } = useGetCurrentUser()



  useEffect(() => {

    if (localStorage.getItem('token') == undefined) {
      Navigate("/sign-in")
    }
    else {
      setUser(currentUser?.user)
    }

  }, [currentUser,user])

  return (
    <main className='flex h-screen'>


      <Routes>
        {/* public */}
        <Route element={<Auth />}>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
        </Route>
        {/* private */}
        <Route element={<Root />}>
          <Route index element={<Home />} />

          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/all-users' element={<AllUsers />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post' element={<UpdatePost />} />
          <Route path='/posts' element={<Posts />} />
          <Route path='/profile/:username/*' element={<Profile />} />
          <Route path='/update-profile' element={<UpdateProfile />} />
          <Route path='/liked-posts' element={<LikedPosts />} />
          <Route path='/followings/:username/*' element={<Followings />} />
          <Route path='/followers/:username/*' element={<Followers />} />


        </Route>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App

