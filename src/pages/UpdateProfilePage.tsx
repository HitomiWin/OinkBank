import React, { memo, VFC, useRef, useState } from "react";
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../contexts/AuthContext";

export const UpdateProfilePage: VFC = memo(() => {
  const displayNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser, setDisplayName, setEmail, setPassword } =
    useAuthContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
      return setError("The passwords does not match");
    }

    setError(null);

    try {
      setLoading(true);
      if (!displayNameRef.current) {
        return;
      } else if (displayNameRef.current.value !== currentUser?.displayName) {
        await setDisplayName(displayNameRef.current.value);
      }
      if (!emailRef.current) {
        return;
      } else if (emailRef.current.value !== currentUser?.email) {
        await setEmail(emailRef.current.value);
      }

      if (!passwordRef.current) {
        return;
      } else if (passwordRef.current.value) {
        await setPassword(passwordRef.current.value);
      }

      setLoading(false);
    } catch (e) {
      setError("Error updating profile. Try logging out and in again.");
      setLoading(false);
    }
  };
  return (
    <>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="rounded-lg">
            <Card.Body>
              <Card.Title className="mb-3  text-center text-secondary">
                Update Profile
                <div className="text-end">
                  <span role="img" aria-label="A piggy bank">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      color="#f0ad4e"
                      size="2x"
                    />
                  </span>
                </div>
              </Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="displayName" className="mb-3 text-secondary">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    ref={displayNameRef}
                    defaultValue={currentUser?.displayName ?? ""}
                  />
                </Form.Group>

                <Form.Group id="email" className="mb-3 text-secondary">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} />
                </Form.Group>

                <Form.Group id="password" className="mb-3 text-secondary">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    autoComplete="new-password"
                  />
                </Form.Group>

                <Form.Group
                  id="password-confirm"
                  className="mb-3 text-secondary"
                >
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    autoComplete="new-password"
                  />
                </Form.Group>

                <Button disabled={loading} type="submit" className="text-info">
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});
