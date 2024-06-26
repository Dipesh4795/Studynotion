import { useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";

import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../../services/formatDate";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";

export default function CoursesTable({ courses, setCourses }) {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
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

  // console.log("All Course ", courses)
  let sectionTime = new Array(0);

  courses?.forEach((course) => {
    let totalDurationInSeconds = 0;
    course.coursecontent.forEach((content) => {
      content.subsections.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeduration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
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

  return (
    <>
      <Table className="rounded-xl  border border-richblack-800 ">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase  text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100  mb-2 md:mb-0">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100  mb-2 md:mb-0">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100  mb-2 md:mb-0">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
                {/* TODO: Need to change this state */}
              </Td>
            </Tr>
          ) : (
            courses?.map((course, index) => (
              <Tr
                key={course._id}
                className="flex gap-x-10  border-b border-richblack-800 px-6 py-8 mb-5 md:mb-0"
              >
                <Td className="flex flex-1 md:gap-x-4 gap-y-5 mb-2 md:mb-0">
                  <img
                    src={course?.thumbnail}
                    alt={course?.coursename}
                    className="h-[148px]  w-[180px] md:w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-y-2 md:gap-y-1 lg:gap-y-0 justify-start md:justify-between  md:mx-2">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course.coursename}
                    </p>
                    <p className="text-md text-richblack-300">
                      {course.coursedescription.split(" ").length >
                      TRUNCATE_LENGTH
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
                      <p className="flex w-fit mt-2 flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <div className="flex w-fit mt-2 flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        Published
                      </div>
                    )}
                  </div>
                </Td>
                <Td className="text-sm font-medium text-richblack-100  mb-2 md:mb-0">
                  {sectionTime[index]}
                </Td>
                <Td className="text-sm font-medium text-richblack-100  mb-2 md:mb-0">
                  ₹{course.price}
                </Td>
                <Td className="text-sm font-medium text-richblack-100  mb-2 md:mb-0 ">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                    title="Edit"
                    className="px-0  md:px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
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
                    title="Delete"
                    className="  pl-4   md:px-2 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
