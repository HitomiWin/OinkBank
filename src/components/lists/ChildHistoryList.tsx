import React, { memo, VFC, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Container,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { useParams } from "react-router-dom";
import { DocumentData, serverTimestamp } from "firebase/firestore";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { useAuthContext } from "../../contexts/AuthContext";
import useGetChild from "../../hooks/useGetChild";
import { HistoryCard } from "../../components/cards/HistoryCard";
import useAddTransactions from "../../hooks/useAddTransactions";
import useGetTransactions from "../../hooks/useGetTransactions";
import useGetTotalAmount from "../../hooks/useGetTotalAmount";

export const ChildHistoryList: VFC = memo(() => {
  const { id } = useParams();
  const priceRef = useRef<HTMLInputElement>(null);
  const uuid: string = uuidv4();
  const child: DocumentData = useGetChild(id ?? "");
  const { currentUser } = useAuthContext();
  const transactionsQuery = useAddTransactions(id ?? "");
  const transActions = useGetTransactions(id ?? "");
  const totalAmount = useGetTotalAmount(id ?? "");

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        Keep track of your spending below by entering the anount. Any
        withdrawals can simply be entered with a minus sign in front of the sum
      </Popover.Body>
    </Popover>
  );
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isRegular = false;

    if (!priceRef.current || !priceRef.current.value.length) {
      return;
    }
    if (currentUser && child && child.data) {
      await transactionsQuery.addTransaction({
        id: uuid,
        created: serverTimestamp(),
        paymentDate: moment().format("YYYY-MM-DD"),
        price: parseInt(priceRef.current.value),
        parent: currentUser.uid,
        child: child.data.id,
        isRegular,
      });
    }
  };

  if (child.isError) {
    return <Alert variant="warning">{child.error}</Alert>;
  }
  if (child.isLoading) {
    return (
      <div className="spinner-wrapper">
        <Spinner animation="grow" variant="secondary" />
      </div>
    );
  }

  if (transactionsQuery && priceRef.current) {
    priceRef.current.value = "";
  }
  return transactionsQuery && child && child.data ? (
    <Container>
      <Row className="justify-content-center">
        <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
          <Row className="d-f align-items-center justify-content-between py-0 px-lg-5 m-0 bg-info rounded">
            <Col xs={{ span: 5 }}>
              <h3 className="mt-3">{child.data.name}</h3>
            </Col>
            <Col xs={{ span: 5 }} className="text-end">
              <h4 className="mt-3">{totalAmount} kr</h4>
            </Col>
          </Row>
          <div className="mt-3 px-lg-5 py-3 bg-info rounded">
            <Card.Body className="pb-5">
              {transactionsQuery.isError && (
                <Alert variant="danger"> {transactionsQuery.error} </Alert>
              )}
              <Card.Title className="d-flex text-secondary justify-content-center mb-4">
                <h4> Deposit or withdraw amount &nbsp;</h4>
                <OverlayTrigger
                  trigger="click"
                  key="top"
                  placement="top"
                  overlay={popover}
                >
                  <p>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      color="rgb(24, 24, 82)"
                      size="sm"
                      className="hover-icon circle-info"
                    />
                  </p>
                </OverlayTrigger>
              </Card.Title>
              <Form onSubmit={handleOnSubmit}>
                <Row>
                  <Col xs={12}>
                    <Form.Control
                      type="number"
                      placeholder="Enter amount ex. 10, -10"
                      ref={priceRef}
                    />
                  </Col>
                  <div className="d-flex p-md-0 m-xs-2">
                    <Col
                      xs={{ span: 2, offset: 9 }}
                      md={{ span: 2, offset: 10 }}
                      className="mt-4"
                    >
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={transactionsQuery.isLoading === true}
                        className="text-info text-end"
                      >
                        Save
                      </Button>
                    </Col>
                  </div>
                </Row>
              </Form>
            </Card.Body>
            <hr />
            <div>
              <h4 className="text-center">History of deposit or withdraw </h4>
              <div>
                {transActions.isError && (
                  <Alert variant="danger"> {transActions.error} </Alert>
                )}
                {transActions.isLoading && <p>Loading...</p>}

                {transActions &&
                transActions.data &&
                transActions.data.length ? (
                  transActions.data.map((transaction) => (
                    <HistoryCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))
                ) : (
                  <h4 className="text-center my-4">No history</h4>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  ) : (
    <p className="text-center">No Child</p>
  );
});
