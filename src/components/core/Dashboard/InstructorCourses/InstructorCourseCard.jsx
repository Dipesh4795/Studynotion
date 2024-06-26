import React from "react";
import { COURSE_STATUS } from "../../../../utils/constants";
import { FaCheck } from "react-icons/fa";
import { formatDate } from "../../../../services/formatDate";
import { MdAccessTime } from "react-icons/md";
import { GiPriceTag } from "react-icons/gi";

import { HiClock } from "react-icons/hi";
import { useState } from "react";
import ConfirmationModal from "../../../common/ConfirmationModal";
// import { setCourse, setEditCourse } from "../../../../slices/courseSlice";

import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const InstructorCourseCard = ({ course, setCourses }) => {
  let totalDurationInSeconds = 0;
  course.coursecontent.forEach((content) => {
    content.subsections.forEach((subSection) => {
      const timeDurationInSeconds = parseInt(subSection.timeduration);
      totalDurationInSeconds += timeDurationInSeconds;
    });
  });
  let totalDuration = 0;
  const hours = Math.floor(totalDurationInSeconds / 3600);
  const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
  const seconds = Math.floor((totalDurationInSeconds % 3600) % 60);

  if (hours > 0) {
    totalDuration = `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    totalDuration = `${minutes}m ${seconds}s`;
  } else {
    totalDuration = `${seconds}s`;
  }

  const TRUNCATE_LENGTH = 30;
  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  return (
    <div className="flex flex-col p-4 gap-4 outline-richblack-700  bg-richblack-700 rounded-lg">
      <img
        src={course?.thumbnail}
        alt={course?.coursename}
        className=" w-full h-[200px] rounded-lg object-cover object-center"
      />
      <div className="flex flex-col gap-2 items-start">
        <p className="text-2xl font-semibold text-richblack-5">
          {course.coursename}
        </p>
        <p className="text-lg text-richblack-300">
          {course.coursedescription.split(" ").length > TRUNCATE_LENGTH
            ? course.coursedescription
                .split(" ")
                .slice(0, TRUNCATE_LENGTH)
                .join(" ") + "..."
            : course.coursedescription}
        </p>
        <p className="text-[12px] text-white">
          Created: {formatDate(course.createdate)}
        </p>
        {course.status === COURSE_STATUS.DRAFT ? (
          <p className="flex w-fit  flex-row items-center gap-2 rounded-full  bg-richblack-800 p-2 py-[4px] text-[12px] font-medium text-pink-100">
            <HiClock size={14} />
            Drafted
          </p>
        ) : (
          <div className="flex w-fit  flex-row items-center gap-2 rounded-full bg-richblack-800 p-2 py-[2px] text-[12px] font-medium text-yellow-100">
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
              <FaCheck size={8} />
            </div>
            Published
          </div>
        )}
      </div>
      <div className="flex gap-3 items-center text-white">
        <MdAccessTime size={25} />
        <p>Total Duration : {totalDuration}</p>
      </div>
      <div className="flex gap-3 items-center text-white">
        <GiPriceTag size={25} />
        <p>Price : {course.price}</p>
      </div>
      <div className="flex flex-col   gap-4">
        <button
          className="bg-yellow-100 outline py-2 px-6 rounded-lg"
          disabled={loading}
          onClick={() => {
            navigate(`/dashboard/edit-course/${course._id}`);
          }}
        >
          Edit
        </button>
        <button
          className="bg-richblack-600 outline py-2 px-4  rounded-lg"
          disabled={loading}
          onClick={() => {
            setConfirmationModal({
              text1: "Do you want to delete this course?",
              text2: "All the data related to this course will be deleted",
              btn1Text: !loading ? "Delete" : "Loading...  ",
              btn2Text: "Cancel",
              btn1Handler: !loading
                ? () => handleCourseDelete(course._id)
                : () => {},
              btn2Handler: !loading
                ? () => setConfirmationModal(null)
                : () => {},
            });
          }}
        >
          Delete
        </button>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default InstructorCourseCard;
