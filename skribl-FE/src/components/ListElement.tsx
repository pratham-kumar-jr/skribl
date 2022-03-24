import React from "react";

interface Props {
  name :string;
  score:number
}

const ListElement: React.FC<Props> = ({score,name}) => {
  return (
    <div className=" bg-orange-200 p-2 m-2 rounded-sm flex justify-start items-center space-x-4 ">
      <div className=" w-12 h-12 border border-black">Image</div>
      <div>
        <p>{name}</p>
        <p>{score}</p>
      </div>
    </div>
  );
};

ListElement.defaultProps = {};

export default React.memo(ListElement);
