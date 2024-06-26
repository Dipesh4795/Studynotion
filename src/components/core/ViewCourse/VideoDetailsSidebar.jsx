import { useEffect, useState } from "react";

import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TiArrowSortedDown } from "react-icons/ti";

import IconBtn from "../../common/IconBtn";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  let sectionTime = new Array(0);

  courseSectionData.forEach((content) => {
    let totalDurationInSeconds = 0;
    content.subsections.forEach((subSection) => {
      const timeDurationInSeconds = parseInt(subSection.timeduration);
      totalDurationInSeconds += timeDurationInSeconds;
    });

    let totalTime = 0;

    const hours = Math.floor(totalDurationInSeconds / 3600);
    const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
    const seconds = Math.floor((totalDurationInSeconds % 3600) % 60);

    if (hours > 0) {
      totalTime = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      totalTime = `${minutes}m ${seconds}s`;
    } else {
      totalTime = `${seconds}s`;
    }
    sectionTime.push(totalTime);
  });

  useEffect(() => {
    (() => {
      if (!courseSectionData.length) return;
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subsections.findIndex((data) => data._id === subSectionId);
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subsections?.[
          currentSubSectionIndx
        ]?._id;
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
      setVideoBarActive(activeSubSectionId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[150px] cp2:w-[150px] cp3:w-[200px] md:w-[320px] md:max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex md:flex-row flex-col w-full md:items-center md:justify-between gap-4 ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`);
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>
            <IconBtn
              text="Add Review"
              // customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>
          <div className="flex flex-col">
            <p>{courseEntireData?.coursename}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((section, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(section?._id)}
              key={index}
            >
              {/* Section */}
              <div className="flex flex-col gap-1 md:flex-row justify-between bg-richblack-600 pr-2 pl-3 py-2">
                <div className="w-fit font-semibold text-lg">
                  {section?.sectionname}
                </div>
                <div className="flex items-center gap-6 justify-between text-[10px] sm:text-[15px] font-medium">
                  <div className="flex gap-2">
                    <span>{section?.subsections.length} Lession</span>
                    <span>{sectionTime[index]}</span>
                  </div>
                  <span
                    className={`${
                      activeStatus === section?._id ? "rotate-0" : "rotate-180"
                    } transition-all duration-500 `}
                  >
                    <TiArrowSortedDown size={20} />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              {activeStatus === section?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {section.subsections.map((topic, i) => (
                    <div
                      className={`flex gap-3  px-5 py-2 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      } `}
                      key={i}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                        );
                        setVideoBarActive(topic._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        onChange={() => {}}
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
