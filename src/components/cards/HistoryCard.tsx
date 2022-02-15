import { memo, VFC } from "react";
import { Col, Card } from "react-bootstrap";
import { Transaction } from "../../shared/interfaces";

interface Props {
  transaction: Transaction;
}

export const HistoryCard: VFC<Props> = memo(({ transaction }) => {
  const paymentDate = transaction.paymentDate.slice(0, -8);

  if (!transaction) {
    <p>No history</p>;
  }
  return (
    transaction && (
      <>
        <Col>
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
