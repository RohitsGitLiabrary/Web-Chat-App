import { React } from "react";
import { useFirebase } from "../Firebase/Firebase";

const Loggedinuserdetail = () => {
  const { currentUser } = useFirebase();
  return (
    <div className="p-4 bg-gray-100 border-b sticky top-0 z-10">
      <div className="p-4 bg-gray-100 border-b sticky top-0 z-10">
        {currentUser && < div className="w-20 h-20 bg-gray-300 rounded-full mx-auto">
          <img
            src={currentUser.imgURL}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>}
        <h3 className="text-lg mt-4 text-center font-medium text-gray-800">
          {currentUser
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : "Loading...."}
        </h3>
      </div>
    </div >
  );
};

export default Loggedinuserdetail;
