import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { deleteProfile } from "../../../../services/operations/SettingsAPI";
import { useState } from "react";

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  return (
    <>
      <div className="my-10 flex  flex-col sm:flex-row gap-x-5 items-center  sm:items-start rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        <div className="flex aspect-square  w-14 items-center justify-center rounded-full bg-pink-700 min-[548px]:p-4 max-[1000px]:p-4">
          <AiFillDelete size={25} className="text-4xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="  md:w-[80%] lg:w-3/5 text-pink-25">
            <p>Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer italic text-pink-300"
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "Your Account will delete Permanently.",
                btn1Text: "Delete",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(deleteProfile(token, navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
          >
            I want to delete my account.
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
