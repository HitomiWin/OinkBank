import { VFC, memo } from "react";
import { useNavigate } from "react-router-dom";
import { AddChildForm } from "../components/forms/AddChildForm";

export const AddChildPage: VFC = memo(() => {
  const navigate = useNavigate();
  return (
    <>
      <p className="back-button" onClick={() => navigate(-1)}>
        Back
      </p>
      <h2 className="text-center my-md-4 my-3">Add Child</h2>
      <AddChildForm />
    </>
  );
});
