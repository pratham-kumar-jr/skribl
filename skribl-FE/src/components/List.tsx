import React from "react";
import ListElement from "./ListElement";

interface Props {
  className?: string;
  title: string;
}

const List: React.FC<Props> = ({ className, title }) => {
  return (
    <div className={` p-2 ${className}`}>
      <h2 className=" text-xl font-medium text-center">{title}</h2>
      <ListElement></ListElement>
    </div>
  );
};

List.defaultProps = {};

export default React.memo(List);
