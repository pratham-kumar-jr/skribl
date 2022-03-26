import React from "react";

interface Props {
    className?:string
    children:string
}

const Header: React.FC<Props> = ({children,className}) => {
  return<h1 className={`text-7xl max-w-min p-2 ${className} `}>{children}</h1>
}

Header.defaultProps = {};

export default React.memo(Header);