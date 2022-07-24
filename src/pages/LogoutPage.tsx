import React, { useEffect, memo, VFC } from "react";
import { Link } from "react-router-dom";

import { useAuthContext } from "../contexts/AuthContext";
export const LogoutPage: VFC = memo(() => {
  const { logout } = useAuthContext();

  useEffect(() => {
    logout();
  });

  return (
    <>
      <div className="text-center my-3">
        <Link to={"/"} className="my-3 color-yellow">
          <h5 className="color-yellow">Login?</h5>
        </Link>
        <h2 className="my-3"> Thank you ! You are logged out. </h2>
      </div>
    </>
  );
});
