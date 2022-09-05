import { memo, VFC } from "react";
import { Col, Row } from "react-bootstrap";
import { DocumentData } from "firebase/firestore";

interface Props {
  transaction: DocumentData;
}

export const HistoryCard: VFC<Props> = memo(({ transaction }) => {
  const paymentDate = transaction.paymentDate;

  if (!transaction) {
    return null;
  }
  return (
    transaction && (
      <>
        <Row className="history-list">
          <Col xs={6} className="text-secondary">
            {paymentDate}
          </Col>
          <Col className="">{transaction.price.toString()}kr</Col>
        </Row>
      </>
    )
  );
});
