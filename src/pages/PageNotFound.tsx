import { memo, VFC } from "react";
import Container from "react-bootstrap/Container";

export const PageNotFound: VFC = memo(() => {
  return (
    <Container className="py-3">
      <h1>Sorry, that page could not be found!</h1>
    </Container>
  );
});
