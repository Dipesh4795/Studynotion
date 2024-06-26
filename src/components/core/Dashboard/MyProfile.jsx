import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// import { formattedDate } from "../../../utils/dateFormatter";
import IconBtn from "../../common/IconBtn";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  console.log("user addtional detail is", user);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-14 mt-14 md:mt-0  text-3xl font-medium text-richblack-5">
        My Profile
      </h1>
      <div className="flex mx-auto flex-col md:flex-row w-fit cp2:w-full  gap-3 md:gap-0 items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex  sm:flex-row flex-col gap-y-4 sm:gap-y-4 items-center justify-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstname}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1 mx-auto flex flex-col sm:justify-center">
            <p className="text-lg font-semibold text-richblack-5 mx-auto sm:mx-0">
              {user?.firstname + " " + user?.lastname}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings");
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <div className="my-10 flex flex-col gap-y-10 mx-auto pr-[100px] cp2:pr-12 pl-12 w-fit cp2:w-full  rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 ">
        <div className="flex  flex-col gap-3 md:flex-row md:gap-0 w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionaldetails?.aboutme
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium`}
        >
          {user?.additionaldetails?.aboutme ?? "Write Something About Yourself"}
        </p>
      </div>
      <div className="my-10 flex flex-col gap-y-10  w-fit cp2:w-full rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex  flex-col sm:flex-row gap-y-4 sm:gap-y-0  w-fit cp2:w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="flex max-w-[500px] flex-col  gap-y-4 justify-between">
          <div className="flex sm:flex-row sm:justify-between flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstname}
              </p>
            </div>
            <div className="pr-[63px]">
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastname}
              </p>
            </div>
          </div>
          <div className="flex min-[600px]:flex-row min-[600px]:justify-between flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email Address </p>
              <p className="text-sm font-medium text-richblack-5">
                {user.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Contact Number </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionaldetails?.contactnumber ?? "Add Contact Number"}
              </p>
            </div>
          </div>
          <div className="flex sm:flex-row sm:justify-between flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionaldetails?.gender ?? "Add Gender"}
              </p>
            </div>
            <div className="pr-[25px]">
              <p className="mb-2 text-sm text-richblack-600">Date of Birth </p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionaldetails?.dob ?? "Add Date of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
