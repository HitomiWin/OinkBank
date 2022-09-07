import React, { useRef, useState, VFC, memo } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { Wellcome } from "../pages/partials/Wellcome";

export const LoginPage: VFC = memo(() => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!emailRef.current || !passwordRef.current) {
      return;
    } else {
      try {
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value);
        navigate("/");
      } catch (e: any) {
        if (e.code.includes("auth")) {
          setError("Bad Credentials.");
        } else {
          setError("Something went wrong");
        }
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Wellcome />
      <Row className="py-3">
        <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
          <Card className="rounded-lg px-3">
            <Card.Body>
              <Card.Title className="mb-3  text-center text-secondary">
                Log In
              </Card.Title>

              {error && <p className="text-danger text-center">{error}</p>}

              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3 text-secondary">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>

                <Form.Group id="password" className="mb-3 text-secondary">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <div className="text-center pt-3">
                  <Button
                    disabled={loading}
                    className="text-info px-5"
                    type="submit"
                  >
                    Log In
                  </Button>
                </div>
              </Form>
            </Card.Body>
            <div className="text-center mb-3 text-primary">
              Are you not a member yet?&nbsp;&nbsp;
              <Link to="/signup" className="text-primary">
                Signup
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
});
