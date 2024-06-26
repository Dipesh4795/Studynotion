import { useDispatch, useSelector } from "react-redux";

import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";
import { resetCart } from "../../../../slices/cartSlice";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);
  console.log(total);
  console.log(totalItems);
  const dispatch = useDispatch();
  return (
    <>
      <div className="flex  flex-col mx-4  mt-12 md:mt-0 w-fit cp2:w-full border-b  border-b-richblack-400 pb-2">
        <div className="w-11/12">
          <h1 className="mb-10 text-3xl font-medium text-richblack-5">Cart</h1>
        </div>
        <div className=" flex sm:flex-row-reverse sm:justify-between sm:items-center items-start   flex-col gap-y-4 pb-4">
          <button
            className="  outline w-fit mr-4 bg-richblack-700 px-2 py-2 rounded-md  text-white "
            onClick={() => dispatch(resetCart())}
          >
            Reset Cart
          </button>
          <p className=" font-semibold text-richblack-400">
            {totalItems} Courses in Cart
          </p>
        </div>
      </div>

      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-richblack-100">
          Your cart is empty
        </p>
      )}
    </>
  );
}
