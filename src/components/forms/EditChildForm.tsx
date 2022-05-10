import React, { useRef, useState, VFC, memo } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentData } from "firebase/firestore";
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import useEditChild from "../../hooks/useEditChild";

interface Props {
  id: string;
  child: DocumentData;
}

export const EditChildForm: VFC<Props> = memo(({ id, child }) => {
  const nameRef = useRef<HTMLInputElement>(child.name);
  const priceRef = useRef<HTMLInputElement>(child.price);
  const [isWeekly, setIsWeekly] = useState<boolean>(child.isWeekly);
  const mutation = useEditChild();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameRef.current || !priceRef.current) {
      return;
    }

    mutation.mutate(id, {
      name: nameRef.current.value.length ? nameRef.current.value : child.name,
      price: priceRef.current.value.length
        ? parseInt(priceRef.current.value)
        : child.price,
      isWeekly,
      // if isWeekly changed value, todays date sets to lastDate
      lastDate: child.lastDate,
    });
    nameRef.current.value = "";
    priceRef.current.value = "";
    setIsWeekly(isWeekly);
    navigate("/");
  };

  return (
    <>
      <Row>
        <Col
          xs={{ span: 12 }}
          md={{ span: 8, offset: 2 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Card className="rounded-lg">
            <Card.Body>
              {mutation.isError && (
                <Alert variant="danger">{mutation.error}</Alert>
              )}
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
                        ref={nameRef}
                        defaultValue={child.name}
                      />
                    </Col>
                    <Col
                      xs={{ span: 2, order: 1, offset: 9 }}
                      md={{ span: 2, order: 3, offset: 0 }}
                    >
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        color="#D7D4D4"
                        size="3x"
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
                        defaultValue={child.price}
                      />
                    </Col>
                    <Col xs={2} className="d-flex">
                      <p className="mb-0 align-self-end">Kr</p>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group id="frequency" className="mb-3 text-secondary">
                  <Row>
                    <Col xs={3} md={2}>
                      <Form.Label>Frequency</Form.Label>
                    </Col>
                    <ButtonGroup>
                      <Col
                        xs={{ span: 2, offset: 0 }}
                        md={{ span: 2, offset: 2 }}
                      >
                        <Button
                          className={`frequency-button ${
                            isWeekly ? "active" : "inactive"
                          }`}
                          onClick={() => setIsWeekly(!isWeekly)}
                          disabled={isWeekly}
                        >
                          Weekly
                        </Button>
                      </Col>
                      <Col
                        xs={{ span: 2, offset: 6 }}
                        md={{ span: 2, offset: 3 }}
                      >
                        <Button
                          className={`frequency-button ${
                            !isWeekly ? "active" : "inactive"
                          }`}
                          onClick={() => setIsWeekly(!isWeekly)}
                          disabled={!isWeekly}
                        >
                          Monthly
                        </Button>
                      </Col>
                    </ButtonGroup>
                  </Row>
                </Form.Group>
                <Row>
                  <Col
                    xs={{ span: 2, offset: 8 }}
                    md={{ span: 2, offset: 9 }}
                    lg={{ span: 2, offset: 10 }}
                  >
                    <Button
                      disabled={mutation.isLoading}
                      type="submit"
                      className="text-info mt-1"
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
