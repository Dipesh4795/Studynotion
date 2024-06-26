import React from "react";
import Highlighttext from "./Highlighttext";
import CtaButton from "../../../components/core/Homepage/CtaButton";
import Know_your_progress from "../../../assets/Images/Know_your_progress.png";
import Compare_with_others from "../../../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";

const LearningLanguageSection = () => {
  return (
    <div>
      <div className="text-4xl font-semibold text-center my-10">
        Your swiss knife for
        <Highlighttext text={"learning any language"} />
        <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
          Using spin making learning multiple languages easy. with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
          <img
            src={Know_your_progress}
            alt=""
            className="object-contain rounded-lg  lg:-mr-32 "
            draggable="false"
          />
          <img
            src={Compare_with_others}
            alt=""
            className="object-contain rounded-lg lg:-mb-10 lg:-mt-0 -mt-12"
            draggable="false"
          />
          <img
            src={Plan_your_lessons}
            alt=""
            className="object-contain rounded-lg  lg:-ml-36 lg:-mt-5 -mt-16"
            draggable="false"
          />
        </div>
      </div>

      <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
        <CtaButton active={true} linkto={"/signup"}>
          <div className="">Learn More</div>
        </CtaButton>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
