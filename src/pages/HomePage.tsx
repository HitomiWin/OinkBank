import { memo, VFC } from "react";
import { Container } from "react-bootstrap";
import { ChildrenList } from "../components/lists/ChildrenList";

export const HomePage: VFC = memo(() => {
  return (
    <Container className="my-4">
      <ChildrenList />;
    </Container>
  );
});
