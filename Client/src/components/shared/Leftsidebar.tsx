import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { useGetCurrentUser, useSignOutAccount } from '@/lib/react-query/query'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
import { userAtom } from '@/lib/recoilStateManager/currentUser'
import { useRecoilValue } from 'recoil'


type userProps = {
  user?: any,

}

const Leftsidebar = ({ user }: userProps) => {

  
  const { data: currentUser , isPending: isCurrentUser } = useGetCurrentUser()
  const { mutate: signOutUser} = useSignOutAccount()
  const Navigate = useNavigate()
  const { pathname } = useLocation()


  user = useRecoilValue(userAtom)
  console.log(user)


  const signOut=()=>{
    signOutUser()
    Navigate("/sign-in")
  }


  return (
    <nav className="leftsidebar">
      
      <div className='flex  flex-col gap-11'>
        <Link to="/" className='flex gap-3 items-center'>
          <img
            src='/assets/images/logo.svg'
            alt='logo'
            width={170}
            height={36}
          />
        </Link>
        {isCurrentUser ? "" :
        <Link to={`/profile/${currentUser?.user.username}`} className='flex-center gap-3'>
          <img src={"/assets/icons/profile-placeholder.svg"}
            alt='profile' className='h-14 w-14 rounded-full' />

          <div className='flex flex-col'>
            <p className='body-bold'>
              @{(user===undefined)?currentUser?.user.username : user.username}

            </p>
            <p className='small-regular text-light-3'>
              {user ? user?.name : "User"}

            </p>

          </div>
        </Link>}

        <ul className='flex flex-col gap-3'>
          {sidebarLinks.map((link: INavLink) => {
            const isActiveLink = pathname === link.route
            return (
              <li className={`leftsidebar-link group ${isActiveLink && `bg-primary-500`}`}
                key={link.label}>
                <NavLink to={link.route} className="flex gap-4 p-4 items-center">
                  <img src={link.imgURL} className={`group-hover:invert-white 
                            ${isActiveLink && 'invert-white'}`} alt="" />
                  {link.label}

                </NavLink>

              </li>
            )
          })}
        </ul>

      </div>

      {/* <div className='pt-12 mt-12'> */}
      <Button variant="ghost" type='submit' className='shad-button_ghost ' onClick={() => signOut()}>
        <img
          src='/assets/icons/logout.svg' alt='logout'
        />
        <p className='small-medium lg:base-medium'>
          Logout
        </p>
      </Button>
      {/* </div> */}
        

    </nav>
  )
}

export default Leftsidebar
