"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import LogOut from "./../../../public/logout.svg";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: FC<ButtonProps> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-[#A194D2] font-medium text-[14px] leading-[18.23px] text-right bg-none border-none cursor-pointer flex items-center"
  >
    {children}
  </button>
);

const LogoutButton: FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <Button onClick={handleLogout}>
      <span style={{ marginRight: "8px" }}>
        <Image src={LogOut} width={14} height={14} alt="Logout icon" />
      </span>
      Log Out
    </Button>
  );
};

export default LogoutButton;
