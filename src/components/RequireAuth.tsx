import { VFC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

interface Props {
  children: ReactElement;
  redirectTo: string;
}

const RequireAuth: VFC<Props> = ({ children, redirectTo }) => {
  const { currentUser } = useAuthContext();

  return currentUser ? children : <Navigate to={redirectTo} />;
};

export default RequireAuth;
