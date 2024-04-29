import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetCurrentUser, useGetPostByUsername, useGetUserBySearch, useGetUserByUsername } from "@/lib/react-query/query";
import { useState } from "react";


const AllUsers = () => {


  type SearchResultProps = {
    isSearching: boolean;
    users: any;
  };

  const SearchResults = ({ isSearching, users }: SearchResultProps) => {
    if (isSearching) {
      return <Loader />;
    } else if (users && users.length > 0) {
      return users.map((user: any) => (<UserCard  user={user} />))
    } else {
      return (
        <p className="text-light-4 mt-10 text-center w-full">No results found</p>
      );
    }
  };



  const [searchValue, setSearchValue] = useState("")
  let debouncedValue = useDebounce(searchValue, 500)

  const { data: users, isFetching: isSearching } = useGetUserBySearch(debouncedValue)
  const { data: currentUser } = useGetCurrentUser()


  const shouldShowSearchResults = searchValue !== "";

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search User</h2>
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
          {shouldShowSearchResults ? (
            <SearchResults
              isSearching={isSearching}
              users={users}
            />
          ) : ""}
        </div>
      </div>
    </div>
  );
}


export default AllUsers
