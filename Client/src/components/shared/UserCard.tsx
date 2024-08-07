import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useGetCurrentUser } from "@/lib/react-query/query";

type UserCardProps = {
  user: any;
};

const UserCard = ({ user }: UserCardProps) => {
  console.log(user);

  const { data: currentUser } = useGetCurrentUser();

  return (
    <Link to={`/profile/${user.username}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      {currentUser?.user.username === user.username ? (
        <h2>You</h2>
      ) : (
        <Button type="button" size="sm" className="shad-button_primary px-5">
          Visit
        </Button>
      )}
    </Link>
  );
};

export default UserCard;
