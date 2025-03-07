import { ReactNode } from "react";

const Card: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="max-w-sm p-6 rounded-lg shadow-sm bg-[#3E529833] min-w-[560px]  w-full rounded-[15px] p-[40px] px-[48px]">
      {children}
    </div>
  );
};

export default Card;
