import { VFC, memo } from "react";
import { useNavigate } from "react-router-dom";
import { AddChildForm } from "../components/forms/AddChildForm";

export const AddChildPage: VFC = memo(() => {
  const navigate = useNavigate();
  return (
    <>
      <div className="d-flex justify-content-start">
        <p className="back-button col-1" onClick={() => navigate(-1)}>
          Back
        </p>
      </div>
      <h2 className="text-center my-md-4 my-3">Add Child</h2>
      <AddChildForm />
    </>
  );
});
