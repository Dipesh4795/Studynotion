import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);

      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
    }
  };
  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <>
      <div className="text-3xl text-richblack-50 md:mt-0 mt-12">
        Enrolled Courses
      </div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div>
          <div className="my-8 text-richblack-5  hidden md:block">
            {/* Headings */}
            <div className="flex rounded-t-lg bg-richblack-500 ">
              <p className="w-[45%] px-5 py-3">Course Name</p>
              <p className="w-1/4 px-2 py-3">Duration</p>
              <p className="flex-1 px-2 py-3">Progress</p>
            </div>
            {/* Course Names */}
            {enrolledCourses.map((course, i, arr) => (
              <div
                className={`flex items-center border border-richblack-700 ${
                  i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                }`}
                key={i}
              >
                <div
                  className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                  onClick={() => {
                    navigate(
                      `/view-course/${course?._id}/section/${course.coursecontent?.[0]?._id}/sub-section/${course.coursecontent?.[0]?.subsections?.[0]?._id}`
                    );
                  }}
                >
                  <img
                    src={course.thumbnail}
                    alt="course_img"
                    className="h-14 w-32 rounded-lg object-cover"
                  />
                  <div className="flex max-w-xs flex-col gap-2">
                    <p className="font-semibold">{course.coursename}</p>
                    <p className="text-xs text-richblack-300">
                      {course.coursedescription.length > 50
                        ? `${course.coursedescription.slice(0, 50)}...`
                        : course.coursedescription}
                    </p>
                  </div>
                </div>
                <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                  <p>Progress: {course.progressPercentage || 0}%</p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="my-8 text-richblack-5  block md:hidden">
            <div className="w-11/12 mx-auto flex flex-col gap-5">
              {enrolledCourses.map((course, i) => (
                <div
                  className="outline-white rounded-md bg-richblack-800   gap-y-3 flex flex-col items-center"
                  onClick={() => {
                    navigate(
                      `/view-course/${course?._id}/section/${course.coursecontent?.[0]?._id}/sub-section/${course.coursecontent?.[0]?.subsections?.[0]?._id}`
                    );
                  }}
                >
                  <img
                    src={course.thumbnail}
                    alt="course_img"
                    className="w-[80%] aspect-auto  pt-4 rounded-lg object-cover object-top"
                  />
                  <div className="flex  flex-col  items-center gap-2 px-4">
                    <p className=" text-2xl font-semibold">
                      {course.coursename}
                    </p>
                    <p className="text-md text-richblack-300 max-w-[400px] ">
                      {course.coursedescription.length > 50
                        ? `${course.coursedescription.slice(0, 50)}...`
                        : course.coursedescription}
                    </p>
                  </div>
                  <div className=" px-2">
                    {" "}
                    Course Duration : {course?.totalDuration}
                  </div>
                  <div className="flex md:w-1/5 flex-col gap-2 px-2 pb-6">
                    <p>
                      Progress: {course.progressPercentage || 0}
                      <span>%</span>
                    </p>
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="8px"
                      isLabelVisible={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
