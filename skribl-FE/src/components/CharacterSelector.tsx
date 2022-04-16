import React, { Dispatch, SetStateAction } from "react";
interface Props {
  setCurrentCharacter: Dispatch<SetStateAction<string>>;
  children: string[];
  className?: string;
}

const CharacterSelector: React.FC<Props> = ({
  setCurrentCharacter,
  children,
  className,
}) => {
  const handleSelection = (path: string) => {
    setCurrentCharacter(path);
  };
  return (
    <div className={`flex justify-center items-baseline ${className}`}>
      {children.map((path) => (
        <div
          className=" cursor-pointer w-24 h-24"
          onClick={() => handleSelection(path)}
        >
          <img
            src={path}
            alt={path}
            className="w-full h-full hover:scale-125 hover:-translate-y-4"
          />
        </div>
      ))}
    </div>
  );
};

CharacterSelector.defaultProps = {
  className: "",
};

export default React.memo(CharacterSelector);
