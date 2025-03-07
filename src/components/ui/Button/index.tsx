import React from "react";

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <div
      className="max-w-sm p-6 bg-[#3E529833] border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
