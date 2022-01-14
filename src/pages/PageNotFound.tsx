import { memo, VFC } from "react";
import Container from "react-bootstrap/Container";

export const PageNotFound: VFC = memo(() => {
  return (
    <Container className="py-3 text-center">
      <h2>Page Not Found: 404</h2>
    </Container>
  );
});
