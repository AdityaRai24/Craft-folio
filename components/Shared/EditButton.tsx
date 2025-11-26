import { Button } from "@/components/ui/button";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { RootState } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// Utility function to check if buttons should be shown
export const shouldShowEditButtons = (portfolioUserId: string, user: any, isLoaded: boolean) => {
  return isLoaded && (portfolioUserId === "guest" || (user && user.id === portfolioUserId));
};

const EditButton = ({
  sectionName,
  styles,
  divStyles,
}: {
  sectionName: string;
  styles?: string;
  divStyles?: string;
}) => {
  const dispatch = useDispatch();
  const { currentlyEditing } = useSelector(
    (state: RootState) => state.editMode
  );
  const { portfolioUserId } = useSelector((state: RootState) => state.data);
  const { user, isLoaded } = useUser();

  const handleSectionEdit = () => {
    if (currentlyEditing === sectionName) {
      dispatch(setCurrentEdit(""));
    } else {
      dispatch(setCurrentEdit(sectionName));
    }
  };

  const shouldShowButton = shouldShowEditButtons(portfolioUserId, user, isLoaded);

  return (
    <div className={divStyles ? divStyles : "hidden md:block "}>
      {shouldShowButton && (
        <Button
          onClick={handleSectionEdit}
          className={`backdrop-blur bg-white/80 tracking-wider dark:bg-black/60 border border-dashed border-gray-400 dark:border-gray-600 shadow-md text-gray-900 dark:text-gray-100 hover:bg-white/90 dark:hover:bg-black/80 transition-all px-4 py-2 text-sm font-medium ${styles || ''}`}
        >
          {currentlyEditing === sectionName ? "Cancel" : <>✏️ Edit</>}
        </Button>
      )}
    </div>
  );
};

export default EditButton; 