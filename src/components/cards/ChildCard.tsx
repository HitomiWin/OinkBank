import { memo, VFC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faEdit,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { DocumentData, serverTimestamp } from "firebase/firestore";
import moment from "moment";
import useAddTransactions from "../../hooks/useAddTransactions";
import useEditChild from "../../hooks/useEditChild";
import { v4 as uuidv4 } from "uuid";

interface Props {
  child: DocumentData;
}

export const ChildCard: VFC<Props> = memo(({ child }) => {
  const { addTransaction } = useAddTransactions(child.id);
  const [total, setTotal] = useState<number>(0);
  const mutation = useEditChild();
  const isRegular = true;
  const addTransactionWeekly = async () => {
    const startWeeklyDate = moment(
      child.lastDate ?? moment().format("YYYY-MM-DD hh:mm:ss")
    );
    const endWeeklyDate = moment().format("YYYY-MM-DD hh:mm:ss");
    const day = 1; // 1=monday
    let results = [];
    const current = startWeeklyDate?.clone();
    while (current?.day(7 + day).isSameOrBefore(endWeeklyDate)) {
      results.push(current.clone());
    }

    if (results && results.length > 0) {
      results.map(async (result) => {
        await addTransaction({
          id: uuidv4(),
          created: serverTimestamp(),
          paymentDate: result.format("YYYY-MM-DD hh:mm:ss"),
          price: child.price,
          isRegular,
        });
      });
      await mutation.mutate(child.id, {
        lastDate: moment().format("YYYY-MM-DD hh:mm:ss"),
      });
    }
    results = [];
  };
  const addTransactionMonthly = async () => {
    const startMonthlyDate = moment(child.lastDate);
    const endMonthlyDate = moment()
      .startOf("month")
      .format("YYYY-MM-DD hh:mm:ss");
    let results = [];
    const current = startMonthlyDate.clone();

    while (current.isBefore(endMonthlyDate)) {
      current.add(1, "month");
      results.push(current.startOf("month").format("YYYY-MM-DD hh:mm:ss"));
      if (results && results.length > 0) {
        results.map(async (result) => {
          await addTransaction({
            id: uuidv4(),
            created: serverTimestamp(),
            paymentDate: result,
            price: child.price,
            isRegular,
          });
        });
        await mutation.mutate(child.id, {
          lastDate: moment().format("YYYY-MM-DD hh:mm:ss"),
        });
      }
    }
    results = [];
  };

  useEffect(() => {
    if (child && !child.isPause) {
      if (child.isWeekly === true) {
        addTransactionWeekly();
      } else if (child.isWeekly === false) {
        addTransactionMonthly();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child.id, child.isPaused, child.isWeekly]);

  const navigate = useNavigate();

  const handleCardOnClick = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    navigate(`/child-history/${child.id}`);
  };

  const handleEditOnClick = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    navigate(`/edit-child/${child.id}`);
  };

  const handlePauseOnClick = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();

    mutation.mutate(child.id, {
      lastDate: moment().format("YYYY-MM-DD hh:mm:ss"),
      isPaused: !child.isPaused,
    });
  };

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
    child.isWeekly === true
      ? nextMonday
      : moment().add(1, "M").startOf("month").format("YYYY-MM-DD"); // the first date of next month

  const start = moment();
  const end = moment(nextDate);
  const diffDays = end.diff(start, "days") + 1;

  return (
    <>
      <Row className="my-2">
        <Col
          xs={{ span: 12 }}
          md={{ span: 8, offset: 2 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Card className="rounded-lg">
            <Card.Body>
              <Col md={{ span: 12 }}>
                <Row className="mb-2">
                  <Col xs={{ span: 2 }}>
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      color="#D7D4D4"
                      size="3x"
                    />
                  </Col>
                  <Col xs={{ span: 3 }} className="align-self-center">
                    <h4>{child.name}</h4>
                  </Col>
                  <Col
                    xs={{ span: 1 }}
                    md={{ span: 1, offset: 0 }}
                    className="align-self-center"
                  >
                    <FontAwesomeIcon
                      icon={faArrowCircleRight}
                      color="orange"
                      size="lg"
                      onClick={handleCardOnClick}
                    />
                  </Col>
                  <Col
                    xs={{ span: 1, offset: 4 }}
                    md={{ span: 1, offset: 5 }}
                    className="align-self-start"
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      color="#f0ad4e"
                      size="lg"
                      onClick={handleEditOnClick}
                    />
                  </Col>
                </Row>
                <Row className="mb-2 ">
                  <Col xs={{ span: 3, offset: 2 }} md={{ span: 3, offset: 2 }}>
                    <h5>Total</h5>
                  </Col>
                  <Col xs={{ span: 3, offset: 3 }} md={{ span: 3, offset: 2 }}>
                    <h5>{child.total} kr</h5>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={{ span: 3, offset: 2 }} md={{ span: 3, offset: 2 }}>
                    {child.isWeekly ? <h6>Weekly</h6> : <h6>Monthly</h6>}
                  </Col>
                  <Col xs={{ span: 3, offset: 3 }} md={{ span: 3, offset: 2 }}>
                    <h6>{child.price} kr</h6>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={{ span: 10, offset: 2 }} md={{ span: 7, offset: 2 }}>
                    {child.isPaused ? (
                      <h6 className="text-danger">Paused</h6>
                    ) : (
                      <h6>{`Next Allowance in ${diffDays} day(s) +${child.price} kr`}</h6>
                    )}
                  </Col>
                  <Col className="text-center mt-3">
                    <Button
                      // disabled={isLoading}
                      variant="danger"
                      size="sm"
                      onClick={handlePauseOnClick}
                      className="text-info"
                    >
                      {child.isPaused ? <>Re Start ?</> : <>Pause</>}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});
