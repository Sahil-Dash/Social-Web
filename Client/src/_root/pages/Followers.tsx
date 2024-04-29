import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { Input } from "@/components/ui/input";
// import useDebounce from "@/hooks/useDebounce";
// import { useGetCurrentUser, useGetPostByUsername, useGetUserBySearch, useGetUserByUsername } from "@/lib/react-query/query";
import { getUserByUsername } from "@/lib/server_apis/apis";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";



interface UserProfile {
    name: string;
    username: string;
  }
  
  interface UserCollection {
    [username: string]: UserProfile;
  }



const followers = () => {

    const [followers,setFollowers] = useState<UserCollection>()
    const { username } = useParams();



    useEffect(()=>{
        const getUserfollowers = async() =>{
        const res = await getUserByUsername(username || "");
        setFollowers(res.follower)

        }

        getUserfollowers()
    },[])

    // console.log(followers)


//   type SearchResultProps = {
//     isSearching: boolean;
//     users: any;
//   };

//   const SearchResults = ({ isSearching, users }: SearchResultProps) => {
//     if (isSearching) {
//       return <Loader />;
//     } else if (users && users.length > 0) {
//       return users.map((user: any) => (<UserCard currentUser={currentUser} user={user} />))
//     } else {
//       return (
//         <p className="text-light-4 mt-10 text-center w-full">No results found</p>
//       );
//     }
//   };



  const [searchValue, setSearchValue] = useState("")
//   let debouncedValue = useDebounce(searchValue, 500)

//   const { data: users, isFetching: isSearching } = useGetUserBySearch(debouncedValue)
//   const { data: currentUser } = useGetCurrentUser()


//   const shouldShowSearchResults = searchValue !== "";

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">User Followers</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search by @username"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {followers && Object.keys(followers || {}).map(username =>(
                <UserCard key={username} user={{username:followers[username].username , name:followers[username].name}}/>
            ))}


        </div>

        {/* <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {shouldShowSearchResults ? (
            <SearchResults
              isSearching={isSearching}
              users={users}
            />
          ) : ""}
        </div> */}
      </div>
    </div>
  );
}


export default followers
