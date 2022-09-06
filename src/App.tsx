import { memo, VFC } from "react";
import { Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { Container } from "react-bootstrap";
import { Navigation } from "./pages/partials/Navigation";
import { HomePage } from "./pages/HomePage";
import { PageNotFound } from "./pages/PageNotFound";
import { LoginPage } from "./pages/LoginPage";
import { LogoutPage } from "./pages/LogoutPage";
import { SignupPage } from "./pages/SignupPage";
import { AddChildPage } from "./pages/AddChildPage";
import { EditChildPage } from "./pages/EditChildPage";
import { ChildHistoryPage } from "./pages/ChildHistoryPage";
import RequireAuth from "./components/RequireAuth";

export const App: VFC = memo(() => {
  return (
    <>
      <Navigation />
      <Container id="App" className="py-3">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <RequireAuth redirectTo="/login">
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/register-child"
            element={
              <RequireAuth redirectTo="/login">
                <AddChildPage />
              </RequireAuth>
            }
          />
          <Route
            path="/edit-child/:id"
            element={
              <RequireAuth redirectTo="/login">
                <EditChildPage />
              </RequireAuth>
            }
          />
          <Route
            path="/child-history/:id"
            element={
              <RequireAuth redirectTo="/login">
                <ChildHistoryPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Container>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </>
  )
});
