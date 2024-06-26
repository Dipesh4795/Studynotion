import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import CoursesTable from "./InstructorCourses/CoursesTable";
import InstructorCourseCard from "./InstructorCourses/InstructorCourseCard";

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token);
      // console.log("courses is", result);
      if (result) {
        setCourses(result);
      }
    };
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className=" mt-16 md:mt-0 mb-14 flex   flex-col md:flex-row  gap-4 items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>

      <div className="lg:block hidden">
        {courses?.length === 0 && (
          <div className="w-full h-full flex justify-center items-center">
            {" "}
            No Courses Found
          </div>
        )}
        {courses?.length !== 0 && (
          <CoursesTable courses={courses} setCourses={setCourses} />
        )}
      </div>
      <div className="lg:hidden block">
        {courses?.length === 0 && (
          <div className="w-full h-full flex justify-center items-center">
            {" "}
            No Courses Found
          </div>
        )}

        {courses?.length !== 0 && (
          <div className="flex flex-col gap-6 m-6">
            {courses?.map((course, index) => (
              <div key={index}>
                <InstructorCourseCard course={course} setCourses={setCourses} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
