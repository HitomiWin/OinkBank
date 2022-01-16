import React, { useRef, useState, VFC, memo } from "react";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useAuthContext } from "../../contexts/AuthContext";
import { ChildQuery } from "../../shared/interfaces";
import useAddChild from "../../hooks/useAddChild";

export const AddChildForm: VFC = memo(() => {
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const [radioValue, setRadioValue] = useState("1");
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();

  const childQuery: ChildQuery = useAddChild();

  const radios = [
    { name: "Weekly", value: "1" },
    { name: "Monthly", value: "2" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameRef.current || !priceRef.current) {
      return;
    }

    const monday = 1;
    const today = moment().isoWeekday();
    let nextMonday;
    // if we haven't yet passed the day of the week that I need:
    if (today <= monday) {
      // then just give me this week's instance of that day
      nextMonday = moment().isoWeekday(monday).format("YYYY-MM-DD");
    } else {
      // otherwise, give me *next week's* instance of that same day
      nextMonday = moment()
        .add(1, "weeks")
        .isoWeekday(monday)
        .format("YYYY-MM-DD");
    }

    let nextDate =
      radioValue === "1"
        ? nextMonday
        : moment().add(1, "M").startOf("month").format("YYYY-MM-DD"); // the first date of next month

    if (currentUser) {
      await childQuery.addChild({
        name: nameRef.current.value,
        price: parseInt(priceRef.current.value, 10),
        parent: currentUser.uid,
        isWeekly: radioValue === "1" ? true : false,
        isPaused: false,
        nextDate,
        lastDate: moment().format("YYYY-MM-DD"),
        total: 0,
        created: serverTimestamp(),
      });

      nameRef.current.value = "";
      priceRef.current.value = "";
      setRadioValue("1");
      navigate("/");
    }
  };
  if (childQuery.isError) {
    <Alert variant="danger">{childQuery.error}</Alert>;
  }
  if (childQuery.isLoading) {
    <p>Loading...</p>;
  }

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
                      <Form.Control type="text" ref={nameRef} required />
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
                      <Form.Label>Price</Form.Label>
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
                    <Col xs={3} md={2}>
                      <Form.Label>Frequency</Form.Label>
                    </Col>
                    <ButtonGroup>
                      {radios.map((radio, idx) => (
                        <Col
                          key={idx}
                          xs={{ span: 2, offset: 5 }}
                          md={{ span: 2, offset: 2 }}
                        >
                          <ToggleButton
                            className="text-info my-1"
                            id={`radio-${idx}`}
                            type="radio"
                            variant="primary"
                            name="radio"
                            value={radio.value}
                            checked={radioValue === radio.value}
                            onChange={(e) =>
                              setRadioValue(e.currentTarget.value)
                            }
                          >
                            {radio.name}
                          </ToggleButton>
                        </Col>
                      ))}
                    </ButtonGroup>
                  </Row>
                </Form.Group>
                <Row>
                  <Col xs={{ span: 2, offset: 8 }} md={{ span: 2, offset: 10 }}>
                    <Button
                      disabled={childQuery.isLoading}
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
