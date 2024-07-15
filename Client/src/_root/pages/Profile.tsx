import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import { LikedPosts } from "@/_root/pages";
import Loader from "@/components/shared/Loader";
import {
  useFollowUser,
  useGetCurrentUser,
  useGetUserByUsername,
  useUnFollowUser,
} from "@/lib/react-query/query";
import GridPostList from "@/components/shared/GridPostList";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getPostByUsername,
  getUserByUsername,
} from "@/lib/server_apis/apis";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

// type SearchResultProps = {
//   isUser: boolean;
//   isCurrentUser: boolean;
//   user: any;
//   currentUser: any;
// };

const Profile = () => {
  const { username } = useParams();

  const { pathname } = useLocation();

  const [posts, setPosts] = useState([]);
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isfollowing, setIsFollowing] = useState(false);

  const { data: currentUser } = useGetCurrentUser();
  const { data: user, isPending: isUserFetching } = useGetUserByUsername(
    username || ""
  );

  const { mutateAsync: followUser } = useFollowUser();
  const { mutateAsync: unfollowUser } = useUnFollowUser();

  useEffect(() => {
    const getUser = async () => {
      let res = await getUserByUsername(username || "");
      // setuser(res)
      setFollower(Object.keys(res.follower).length);
      setFollowing(Object.keys(res.following).length);

      let post_res = await getPostByUsername(username || "");
      setPosts(post_res);

      let current_user = await getCurrentUser();

      if (Object.keys(current_user?.user.following).includes(username || "")) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    };

    getUser();
  }, [pathname, username]);

  const handleFollower = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (Object.keys(currentUser?.user.following).includes(username || "")) {
      setIsFollowing(false);
      setFollower(follower - 1);

      let data = {
        following_username: currentUser?.user.username,
        follower_username: user.username,
      };
      console.log(data);

      await unfollowUser(data);
    } else {
      setIsFollowing(true);
      setFollower(follower + 1);
      let data = {
        following_username: currentUser?.user.username,
        following_name: currentUser?.user.name,
        follower_username: user.username,
        follower_name: user.name,
      };
      console.log(data);

      await followUser(data);
    }
  };

  return (
    <div className="profile-container">
      {isUserFetching ? (
        <Loader />
      ) : (
        <>
          <div className="profile-inner_container">
            <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
              <img
                src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
              />
              <div className="flex flex-col flex-1 justify-between md:mt-2">
                <div className="flex flex-col w-full">
                  <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                    {user?.name}
                  </h1>
                  <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                    @{user?.username}
                  </p>
                </div>

                <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                  {/* <StatBlock value={currentUser?.user.posts.length} label="Posts" /> */}
                  <StatBlock value={posts && posts.length} label="Posts" />
                  <Link to={`/followers/${username}/`}>
                    <StatBlock value={follower} label="Followers" />
                  </Link>
                  <Link to={`/followings/${username}/`}>
                    <StatBlock value={following} label="Following" />
                  </Link>
                </div>

                <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                  {user?.bio}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <div
                  className={`${
                    currentUser?.user.username !== username && "hidden"
                  }`}
                >
                  <Link
                    to={`/update-profile/${currentUser?.user.username}`}
                    className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                      currentUser?.user.username !== username && "hidden"
                    }`}
                  >
                    <img
                      src={"/assets/icons/edit.svg"}
                      alt="edit"
                      width={20}
                      height={20}
                    />
                    <p className="flex whitespace-nowrap small-medium">
                      Edit Profile
                    </p>
                  </Link>
                </div>
                <div
                  className={`${
                    currentUser?.user.username === username && "hidden"
                  }`}
                >
                  {isfollowing ? (
                    <div
                      className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg `}
                      onClick={handleFollower}
                    >
                      <p className="flex whitespace-nowrap small-medium">
                        Unfollow
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleFollower}
                      className="shad-button_primary px-8"
                    >
                      Follow
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {currentUser?.user.username === 1 && (
            <div className="flex max-w-5xl w-full">
              <Link
                to={`/profile/${username}`}
                className={`profile-tab rounded-l-lg ${
                  pathname === `/profile/${username}` && "!bg-dark-3"
                }`}
              >
                <img
                  src={"/assets/icons/posts.svg"}
                  alt="posts"
                  width={20}
                  height={20}
                />
                Posts
              </Link>
              <Link
                to={`/profile/${username}/liked-posts`}
                className={`profile-tab rounded-r-lg ${
                  pathname === `/profile/${username}/liked-posts` &&
                  "!bg-dark-3"
                }`}
              >
                <img
                  src={"/assets/icons/like.svg"}
                  alt="like"
                  width={20}
                  height={20}
                />
                Liked Posts
              </Link>
            </div>
          )}
          <Routes>
            <Route
              index
              element={<GridPostList posts={posts} showUser={false} />}
            />
            {currentUser?.user.$id === currentUser?.user.id && (
              <Route path="/liked-posts" element={<LikedPosts />} />
            )}
          </Routes>
          <Outlet />
        </>
      )}
    </div>
  );
};

export default Profile;
