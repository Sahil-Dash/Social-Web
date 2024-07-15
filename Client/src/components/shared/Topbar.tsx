import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount, useGetCurrentUser } from "@/lib/react-query/query";

const Topbar = () => {
  const { mutate: signOutUser } = useSignOutAccount();
  const Navigate = useNavigate();

  const { data: currentUser } = useGetCurrentUser();

  const signOut = () => {
    signOutUser();
    Navigate("/sign-in");
  };

  return (
    <div className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>

          <Link
            to={`/profile/${currentUser?.user.username}`}
            className="flex-center gap-3"
          >
            <img
              src={"/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
