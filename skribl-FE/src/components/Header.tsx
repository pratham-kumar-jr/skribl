import React from "react";

interface Props {
    className?:string
    children:string
    size?:string
}

const Header: React.FC<Props> = ({children,className,size}) => {
  return<h1 className={`${size? size : "text-7xl"} max-w-min p-2 ${className} `}>{children}</h1>
}

Header.defaultProps = {};

export default React.memo(Header);