import React, { useRef, useState, VFC, memo } from "react";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useAuthContext } from "../../contexts/AuthContext";
import { ChildQuery } from "../../shared/interfaces";
import useAddChild from "../../hooks/useAddChild";

export const AddChildForm: VFC = memo(() => {
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const [isWeekly, setIsWeekly] = useState<boolean>(true);
  const uuid: string = uuidv4();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();

  const childQuery: ChildQuery = useAddChild();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameRef.current || !priceRef.current) {
      return;
    }

    if (currentUser && isWeekly !== null) {
      await childQuery.addChild({
        id: uuid,
        name: nameRef.current.value,
        price: parseInt(priceRef.current.value, 10),
        parent: currentUser.uid,
        isWeekly,
        isPaused: false,
        lastDate: moment().format("YYYY-MM-DD"),
        created: serverTimestamp(),
      });

      nameRef.current.value = "";
      priceRef.current.value = "";
      setIsWeekly(true);
      navigate("/");
    }
  };
  if (childQuery.isError) {
    <Alert variant="danger">{childQuery.error}</Alert>;
  }
  return (
    <>
      <Row className="mt-3">
        <Col
          xs={{ span: 12 }}
          md={{ span: 8, offset: 2 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Card className="rounded-lg p-3">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group id="name" className="mb-3  text-secondary">
                  <Row>
                    <Col
                      xs={{ span: 12, order: 2, offset: 0 }}
                      md={{ span: 2, order: 1, offset: 0 }}
                    >
                      <Form.Label>Name</Form.Label>
                    </Col>
                    <Col
                      xs={{ span: 12, order: 2, offset: 0 }}
                      md={{ span: 8, offset: 0, order: 2 }}
                    >
                      <Form.Control
                        type="text"
                        maxLength={10}
                        ref={nameRef}
                        required
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group id="price" className="mb-3  text-secondary">
                  <Row>
                    <Col xs={12} md={2}>
                      <Form.Label>Deposit</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        min="1"
                        ref={priceRef}
                        required
                      />
                    </Col>
                    <Col xs={2} className="d-flex">
                      <p className="mb-0 align-self-end">Kr</p>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group id="frequency" className="mb-3 text-secondary">
                  <Row>
                    <Col xs={12}>
                      <Form.Label>Frequency</Form.Label>
                    </Col>
                    <Form.Select
                      aria-label="frequency select"
                      onChange={(e) =>
                        e.target.value === "1"
                          ? setIsWeekly(true)
                          : setIsWeekly(false)
                      }
                    >
                      <option value="1">Weekly</option>
                      <option value="2">Monthly</option>
                    </Form.Select>
                  </Row>
                </Form.Group>
                <Row>
                  <Col xs={{ offset: 8 }}>
                    <Button
                      disabled={childQuery.isLoading || isWeekly === null}
                      type="submit"
                      className="text-info px-3 mt-1"
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});
