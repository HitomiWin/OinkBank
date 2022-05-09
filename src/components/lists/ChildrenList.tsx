import { memo, VFC } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { ChildCard } from "../cards/ChildCard";
import useGetChildren from "../../hooks/useGetChildren";

export const ChildrenList: VFC = memo(() => {
  const childrenQuery = useGetChildren();

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
    </>
  ) : (
    <div className="spinner-wrapper">
      <h3 className="text-center">No Children</h3>
    </div>
  );
});
