import React, { ReactElement } from "react";

interface Props {
    children:ReactElement;
    open:boolean
}

const Notification: React.FC<Props> = ({children,open}) => {

  return (
    <div className={`inset-0 bg-gray-400 fixed bg-opacity-20 
        ${open ? " translate-x-0":"translate-x-100"} 
        transition-transfom duration-200`}>
      <div className="w-full h-full relative">
        <div className=" absolute bg-white shadow-xl rounded-xl p-4 lg:inset-1/4 md:inset-16 inset-y-24 inset-x-10">
          <h2 className="text-5xl text-center mt-1/5 lg:mt-0">Events</h2>
          <div className="lg:w-2/3 h-1/2  mx-auto mt-10 p-2 text-3xl lg:text-xl text-center">
              {children}
            </div>
        </div>
      </div>
    </div>
  );
}

Notification.defaultProps = {};

export default React.memo(Notification);