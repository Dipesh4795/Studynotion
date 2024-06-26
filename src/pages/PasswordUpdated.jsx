import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const PasswordUpdated = () => {
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            Reset Complete !
          </h1>
          <p className="my-4  max-w-[450px] text-[1.125rem] leading-[1.625rem] text-richblack-100">
            All done! We have sent an email to m***********@gmail.com to confirm
          </p>

          <button
            type="submit"
            className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            onClick={() => navigate("/login")}
          >
            Back to login
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordUpdated;
