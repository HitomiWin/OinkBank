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
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

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
  const popover = (
    <Popover id="popover-frequency">
      <Popover.Body>
        How often would you like to deposit to reoccur?
        <br />
        Weekly: "Every Monday",
        <br />
        Monthly: "First of the month"
      </Popover.Body>
    </Popover>
  );
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
                      md={{ span: 3, order: 1, offset: 0 }}
                      className="align-self-center"
                    >
                      <Form.Label>Name</Form.Label>
                    </Col>
                    <Col
                      xs={{ span: 12, order: 2, offset: 0 }}
                      md={{ span: 7, offset: 0, order: 2 }}
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
                    <Col xs={12} md={3} className="align-self-center">
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
                    <Col xs={12} md={3} className="align-self-center">
                      <Form.Label>Frequency</Form.Label>
                    </Col>
                    <Col>
                      <Form.Select
                        aria-label="frequency"
                        className="frequency-select"
                        onChange={(e) =>
                          e.target.value === "1"
                            ? setIsWeekly(true)
                            : setIsWeekly(false)
                        }
                        defaultValue={isWeekly ? "1" : "2"}
                      >
                        <option className="frequency-option" value="1">
                          Weekly
                        </option>
                        <option className="frequency-option" value="2">
                          Monthly
                        </option>
                      </Form.Select>
                    </Col>
                    <Col xs={2} className="d-flex">
                      <OverlayTrigger
                        trigger="click"
                        key="top"
                        placement="top"
                        overlay={popover}
                      >
                        <div className="mb-0 align-self-end">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            color="rgb(24, 24, 82)"
                            className="hover-icon circle-info"
                          />
                        </div>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </Form.Group>
                <Row>
                  <Col className="text-center">
                    <Button
                      disabled={mutation.isLoading}
                      type="submit"
                      className="text-info mt-1 px-5"
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
