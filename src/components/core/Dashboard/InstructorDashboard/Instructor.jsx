import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";

export default function Instructor() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      console.log(instructorApiData);
      if (instructorApiData?.length) {
        setInstructorData(instructorApiData);
      }
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    })();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div>
      <div className=" mt-14 md:mt-0 ">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstname} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : courses.length > 0 ? (
        <div>
          <div className=" my-2 cp2:my-3 flex flex-col min-[1000px]:flex-row gap-4 sm:w-full w-full  h-fit  min-[1000px]:h-[450px] ">
            {/* Render chart / graph */}
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            {/* Total Statistics */}
            <div
              className={`flex  min-[1000px]:w-[250px]  h-fit w-[calc(100vw-180px)]   sm:w-full  flex-col rounded-md bg-richblack-800 p-6`}
            >
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4  flex  flex-col cp3:flex-row flex-wrap min-[1000px]:flex-col  gap-6 justify-between  md:gap-2">
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className=" text-xl cp2:text-3xl font-semibold text-richblack-50">
                    {courses.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-xl cp2:text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-xl cp2:text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-richblack-800 p-6 ">
            {/* Render 3 courses */}
            <div className="flex min-[430px]:flex-row flex-col gap-4 min-[430px]:items-center min-[430px]:justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            <div className="my-4 flex md:flex-row flex-col gap-4  items-start justify-start md:space-x-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className=" w-full md:w-1/3">
                  <img
                    src={course.thumbnail}
                    alt={course.coursename}
                    className="h-[201px] w-full rounded-md object-cover "
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {course.coursename}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course.studentsenrolled?.length} students
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {course.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
