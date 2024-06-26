import React from "react";
import { useNavigate } from "react-router-dom";

const CtaButton = ({ children, linkto, active }) => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => navigate(linkto)}
        className={`text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-full font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
      ${
        active ? "bg-yellow-50 text-black " : "bg-richblack-800"
      } hover:shadow-none hover:scale-[.98] transition-all duration-200 `}
      >
        {children}
      </button>
    </div>
  );
};

export default CtaButton;
