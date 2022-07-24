import { memo, VFC } from "react";
import { ChildrenList } from "../components/lists/ChildrenList";

export const HomePage: VFC = memo(() => {
  return <ChildrenList />;
});
