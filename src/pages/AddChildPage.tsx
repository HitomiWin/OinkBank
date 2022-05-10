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
      <h3 className="text-center">Add Child</h3>
      <AddChildForm />
    </>
  );
});
