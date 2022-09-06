import { memo, VFC } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Spinner, Button } from "react-bootstrap";
import { ChildCard } from "../cards/ChildCard";
import useGetChildren from "../../hooks/useGetChildren";
import { Wellcome } from "../../pages/partials/Wellcome";

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
      <h3 className="text-center">Children</h3>
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
        <Wellcome />
        <div>
          <h5 className="text-primary text-center no-child-text my-2">
            Simply choose the abount to deposit and how often the deposit should
            reoccur.
            <h5 className="text-primary text-center my-3">
              Start now by adding a child below!
            </h5>
          </h5>
        </div>
      </div>
      <div className="text-center">
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
