import React, { useRef, useState, VFC, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
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
import useEditChild from "../../hooks/useEditChild";

interface Props {
  id: string;
  child: DocumentData;
}

export const EditChildForm: VFC<Props> = memo(({ id, child }) => {
  const nameRef = useRef<HTMLInputElement>(child.name);
  const priceRef = useRef<HTMLInputElement>(child.price);
  const [isWeekly, setIsWeekly] = useState<boolean>(child.isWeekly);
  const [priceValue, setPriceValue] = useState<string>("");
  const [nameValue, setNameValue] = useState<string>("");
  const mutation = useEditChild();
  const navigate = useNavigate();
  useEffect(() => {
    setIsWeekly(child.isWeekly);
    setPriceValue(child.price);
    setNameValue(child.name);
  }, [child.isWeekly, child.price, child.name]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameRef.current || !priceRef.current) {
      return;
    }

    await mutation.mutate(id, {
      name: nameRef.current.value.length ? nameRef.current.value : child.name,
      price: priceRef.current.value.length
        ? parseInt(priceRef.current.value)
        : child.price,
      isWeekly,
      // if isWeekly changed value, todays date sets to lastDate
      lastDate: moment().format("YYYY-MM-DD"),
    });
    nameRef.current.value = "";
    priceRef.current.value = "";
    navigate("/");
  };

  return (
    <>
      <Row className="my-4">
        <Col
          xs={{ span: 12 }}
          md={{ span: 8, offset: 2 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Card className="rounded-lg p-3">
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
                        defaultValue={nameValue}
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
                        defaultValue={priceValue}
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
                    <ButtonGroup className="mt-3">
                      <Col
                        xs={{ span: 2, offset: 0 }}
                        md={{ span: 2, offset: 2 }}
                      >
                        <Button
                          className={`btn frequency-button ${
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
                        lg={{ span: 2, offset: 4 }}
                      >
                        <Button
                          className={`btn frequency-button ${
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
