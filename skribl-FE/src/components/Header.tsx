import React from "react";
import PencilTitleImg from "../assests/pencil.png";
interface Props {
  className?: string;
  children: string;
  size?: string;
}

const Header: React.FC<Props> = ({ children, className, size }) => {
  return (
    <h1
      className={`${
        size ? size : "text-7xl"
      } max-w-min p-2 ${className} flex items-start space-x-2 justify-start text-primary `}
    >
      {children}
      <img className="w-14 h-14" src={PencilTitleImg}></img>
    </h1>
  );
};

Header.defaultProps = {};

export default React.memo(Header);
