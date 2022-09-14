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
        <Row className="history-list justify-content-start align-items-center m-2">
          <Col
            xs={6}
            md={{ span: 5, offset: 1 }}
            lg={{ span: 4, offset: 2 }}
            className="text-secondary text-left"
          >
            <p className="my-1">{paymentDate}</p>
          </Col>
          <Col
            xs={6}
            md={5}
            lg={4}
            className={`ml-auto text-end ${
              transaction.price < 0 ? "text-danger" : "text-secondary"
            }`}
          >
            <p className="my-1">{transaction.price.toString()}kr</p>
          </Col>
        </Row>
      </>
    )
  );
});
