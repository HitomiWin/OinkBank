import { VFC, memo } from "react";
import { AddChildForm } from "../components/forms/AddChildForm";

export const AddChildPage: VFC = memo(() => {
  return (
    <>
      <h3 className="text-center">Add Child</h3>
      <AddChildForm />
    </>
  );
});
