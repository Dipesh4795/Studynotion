import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { HiOutlineVideoCamera } from "react-icons/hi";

function CourseSubSectionAccordion({ subSec }) {
  console.log("subSec", subSec.title);
  return (
    <div>
      <div className="flex justify-between py-2 text-white">
        <div className={`flex items-center gap-2 text-white`}>
          <span>
            <HiOutlineVideoCamera />
          </span>
          <p>{subSec?.title}</p>
        </div>
      </div>
    </div>
  );
}

export default CourseSubSectionAccordion;
