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
        <Col xs={12} className="mt-2">
          <Row className="history-list justify-content-between">
            <Col xs={6} className="text-secondary">
              {paymentDate}
            </Col>
            <Col>{transaction.price.toString()}kr</Col>
          </Row>
        </Col>
      </>
    )
  );
});
