import { FaStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";

import { removeFromCart } from "../../../../slices/cartSlice";

export default function RenderCartCourses() {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  let courserating = new Array(0);

  cart?.forEach((course) => {
    let totalrating = 0;
    course.coursecontent.forEach((content) => {
      const rating = parseInt(content?.ratingandreview?.rating);
      totalrating += rating;
    });

    if (course?.ratingandreview?.length === 0) {
      courserating.push(0);
    } else {
      const avgrating =
        parseFloat(totalrating) / parseFloat(course?.ratingandreview?.length);
      courserating.push(avgrating);
    }
  });

  return (
    <div className="flex flex-1 w-11/12 lg:w-full flex-col">
      {cart.map((course, indx) => (
        <div
          key={course._id}
          className={`flex w-full  sm:flex-row flex-col flex-wrap items-start justify-between gap-6 ${
            indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
          } ${
            indx !== 0 && "mt-6"
          }  outline-richblack-800 bg-richblack-800 p-4 rounded-lg`}
        >
          <div className="flex flex-1 flex-col gap-4 xl:flex-row">
            <img
              src={course?.thumbnail}
              alt={course?.coursename}
              className="   h-[150px] w-[90%] md:w-[75%] lg:h-[190px] lg:w-[280px] rounded-lg object-cover object-center"
            />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-richblack-5">
                {course?.coursename}
              </p>
              <p className="text-sm text-richblack-300">
                {course?.category?.categoryname}
              </p>
              <div className="flex min-[630px]:flex-row flex-col   items-start min-[630px]:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-5">{courserating[indx]}</span>
                  <ReactStars
                    count={5}
                    value={courserating[indx]}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
                <div>
                  <span className="text-richblack-400">
                    {course?.ratingandreview?.length} Ratings
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col  items-start sm:items-end space-y-2 mr-4">
            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p className="mb-6 text-3xl font-medium text-yellow-100">
              ₹ {course?.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
