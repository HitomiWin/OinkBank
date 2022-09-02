import React, { memo, VFC, useRef } from "react";
import { Row, Col, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
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
    <>
      <Row>
        <Col
          xs={{ span: 12 }}
          md={{ span: 8, offset: 2 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Row className="d-f align-items-center justify-content-between px-2">
            <Col xs={{ span: 5 }}>
              <h3>{child.data.name}</h3>
            </Col>
            <Col xs={{ span: 5 }} className="text-end">
              <h4>{totalAmount} kr</h4>
            </Col>
          </Row>
          <Card className="mt-3">
            <Card.Body>
              {transactionsQuery.isError && (
                <Alert variant="danger"> {transactionsQuery.error} </Alert>
              )}
              <Card.Title className="text-secondary text-center mb-4">
                Deposit or withdraw amount
              </Card.Title>
              <Form onSubmit={handleOnSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Row className="justify-content-center align-items-center">
                    <Col md={11} lg={10}>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        ref={priceRef}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-end px-2">
                    <Col xs={2} className="mt-4 me-3">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={transactionsQuery.isLoading === true}
                        className="text-info"
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <h3 className="text-center my-4">History of deposit or withdraw </h3>
          <Row className="justify-content-center">
            {transActions.isError && (
              <Alert variant="danger"> {transActions.error} </Alert>
            )}
            {transActions.isLoading && <p>Loading...</p>}

            {transActions && transActions.data && transActions.data.length ? (
              transActions.data.map((transaction) => (
                <HistoryCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <h4 className="text-center my-4">No history</h4>
            )}
          </Row>
        </Col>
      </Row>
    </>
  ) : (
    <p className="text-center">No Child</p>
  );
});
