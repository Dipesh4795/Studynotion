import React, { useRef } from "react";
import { MdOutlineCancel } from "react-icons/md";

import useOnClickOutside from "../../hooks/useOnClickOutside";

const HamburgerMenu = ({
  children,
  isMenuModalOpen,
  setIsMenuModalOpen,
  menuref,
}) => {
  const modalDiv = useRef(null);
  useOnClickOutside(modalDiv, () => setIsMenuModalOpen(false));

  return (
    <div
      className={` md:hidden fixed  w-fit  left-0 top-[72px] z-[100] inset-0 bg-richblack-700 transition-all duration-1000
      ${isMenuModalOpen ? "translate-x-0" : "translate-x-[-100%]"} 
    `}
    >
      <div className="relative">
        <div
          className="absolute top-2 left-20"
          onClick={() => setIsMenuModalOpen((prev) => !prev)}
        >
          {
            isMenuModalOpen && <MdOutlineCancel size={30} fill={"white"} />
            // : (
            //   <MdOutlineCancel size={30} fill={"white"} />
            // )
          }
        </div>
      </div>
      <div className="flex min-h-full">
        <div ref={modalDiv} className=" text-white mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
