import React, { useEffect, useState } from "react";
import RatingStars from "../../common/RatingStars";
// import GetAvgRating from "../../../utils/avgRating";
import { Link } from "react-router-dom";

const Course_Card = ({ course, description, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    // const avgRating = GetAvgRating(course.reviews);
    if (course?.ratingandreview?.length === 0) {
      setAvgReviewCount(0);
      return;
    } else {
      let totalReviewCount = 0;
      course?.ratingandreview?.forEach((element) => {
        totalReviewCount += element?.rating;
      });
      console.log("totalratingcateory page mein", totalReviewCount);

      const avgReview =
        parseFloat(totalReviewCount) /
        parseFloat(course?.ratingandreview?.length);

      setAvgReviewCount(avgReview);
    }
  }, [course]);

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-2xl text-richblack-5 font-bold">
              {course?.coursename}
            </p>
            <p className="text-lg text-richblack-200">
              {course?.coursedescription}
            </p>
            <div className="flex gap-4 items-center">
              <img
                className="h-10 w-10 rounded-full "
                src={course?.instructor?.image}
                alt="courseimage"
              ></img>
              <p className="text-sm text-richblack-50">
                {course?.instructor?.firstname} {course?.instructor?.lastname}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingandreview?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Course_Card;
