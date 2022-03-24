import React, { ReactElement } from "react";
import ListElement from "./ListElement";

interface Props {
  className?: string;
  title: string;
  element : {name:string,score:number}[]
}

const List: React.FC<Props> = ({ className, title,element }) => {
  
  return (
    <div className={` p-2 ${className}`}>
      <h2 className=" text-xl font-medium text-center">{title}</h2>
      <div>
        {element.map((e)=>(<ListElement name={e.name} key={e.name} score={e.score}></ListElement>))}
      </div>
    </div>
  );
};

List.defaultProps = {};

export default React.memo(List);
