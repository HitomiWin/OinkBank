import React, { useRef, useState, VFC, memo } from "react";
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export const SignupPage: VFC = memo(() => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !passwordConfirmRef.current
    ) {
      return;
    } else if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("The password does not match");
    }

    try {
      setLoading(true);
      console.log("try");
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (e: any) {
      console.log("catch");
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Row>
        <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
          <Card className="rounded-lg px-3">
            <Card.Body>
              <Card.Title className="mb-3 text-center text-secondary">
                Sign Up
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3  text-secondary">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>

                <Form.Group id="password" className="mb-3  text-secondary">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>

                <Form.Group
                  id="password-confirm"
                  className="mb-3 text-secondary"
                >
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                  />
                </Form.Group>

                <Button disabled={loading} type="submit" className="text-info">
                  Create Account
                </Button>
              </Form>
            </Card.Body>
            <div className="text-center m-3 text-primary">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Log In
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
});
