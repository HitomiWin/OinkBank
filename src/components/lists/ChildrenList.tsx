import { memo, VFC } from "react";
import { Alert } from "react-bootstrap";
import { ChildCard } from "../cards/ChildCard";
import useGetChildren from "../../hooks/useGetChildren";

export const ChildrenList: VFC = memo(() => {
  const childrenQuery = useGetChildren();

  if (childrenQuery.isError) {
    return <Alert variant="warning">{childrenQuery.error}</Alert>;
  }

  if (childrenQuery.isLoading) {
    return <p>Loading...</p>;
  }
  return childrenQuery.data ? (
    <>
      <h3 className="text-center">Children</h3>
      {childrenQuery.data.map((child) => (
        <ChildCard key={child.id} child={child} />
      ))}
    </>
  ) : (
    <p>No children</p>
  );
});
