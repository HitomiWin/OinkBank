import { memo, VFC } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Spinner, Button } from "react-bootstrap";
import { ChildCard } from "../cards/ChildCard";
import useGetChildren from "../../hooks/useGetChildren";

export const ChildrenList: VFC = memo(() => {
  const childrenQuery = useGetChildren();
  const navigate = useNavigate();

  if (childrenQuery.isError) {
    return <Alert variant="warning">{childrenQuery.error}</Alert>;
  }

  if (childrenQuery.isLoading) {
    return (
      <div className="spinner-wrapper">
        <Spinner animation="grow" variant="secondary" />
      </div>
    );
  }

  return childrenQuery.data && childrenQuery.data.length ? (
    <>
      <h2 className="text-center my-md-4 my-3">Children</h2>
      {childrenQuery.data.map((child) => (
        <ChildCard key={child.id} child={child} />
      ))}
      <div className="text-center">
        <Button
          variant="primary"
          className="text-info my-2"
          onClick={() => {
            navigate("/register-child");
          }}
        >
          Add a child
        </Button>
      </div>
    </>
  ) : (
    <>
      <div>
        <p className="text-primary text-center no-child-text my-5">
          Oink Bank makes it easy to track allowances for kids. Simply choose
          the amount to deposit and how often the deposit should occur.
        </p>
        <p className="text-center">Start now by adding a child below!</p>
      </div>

      <div className="text-center my-2">
        <Button
          variant="primary"
          className="text-info  mt-2"
          onClick={() => {
            navigate("/register-child");
          }}
        >
          Add a child?
        </Button>
      </div>
    </>
  );
});
