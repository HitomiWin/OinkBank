import { memo, VFC } from "react";
import { Col, Card } from "react-bootstrap";
import { Transaction } from "../../shared/interfaces";

interface Props {
  transaction: Transaction;
}

export const HistoryCard: VFC<Props> = memo(({ transaction }) => {
  const paymentDate = transaction.paymentDate;

  if (!transaction) {
    return null;
  }
  return (
    transaction && (
      <>
        <Col md={6} lg={4} className="mt-2">
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <p className="text-secondary">{paymentDate}</p>
              <p>{transaction.price.toString()}kr</p>
            </Card.Body>
          </Card>
        </Col>
      </>
    )
  );
});
