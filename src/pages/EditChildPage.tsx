import { memo, VFC } from "react";
import { useNavigate } from "react-router-dom";
import { EditChildForm } from "../components/forms/EditChildForm";
import { useParams } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";

import useGetChild from "../hooks/useGetChild";

export const EditChildPage: VFC = memo(() => {
  const { id } = useParams();
  const childQuery = useGetChild(id ?? "");
  const navigate = useNavigate();

  if (childQuery.isError) {
    return <Alert variant="warning">{childQuery.error}</Alert>;
  }

  if (childQuery.isLoading) {
    return (
      <div className="spinner-wrapper">
        <Spinner animation="grow" variant="secondary" />
      </div>
    );
  }
  return childQuery.data ? (
    <>
      <p className="back-button" onClick={() => navigate(-1)}>
        Back
      </p>
      <h3 className="text-center">Edit {childQuery.data.name} </h3>
      <EditChildForm id={id ?? ""} child={childQuery.data} />
    </>
  ) : null;
});
