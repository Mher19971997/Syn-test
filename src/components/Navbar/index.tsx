import { useSession } from "next-auth/react";
import LogoutButton from "../LogoutButton";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="relative border-b after:absolute after:left-0 after:bottom-0 after:w-full after:h-[0.5px] after:bg-gradient-to-r after:from-[#6A596C] after:to-[#474B65]">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="text-xl font-semibold text-gray-800"></div>

        {session?.user && (
          <div className="flex gap-5">
            <p className="text-sm flex gap-3 text-[15px] text-[#AEACB2]">
              Logged in as{" "}
              <span className="font-semibold text-[#D0CFD1] text-[14px]">
                {session.user.email}
              </span>
            </p>
            <LogoutButton />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
