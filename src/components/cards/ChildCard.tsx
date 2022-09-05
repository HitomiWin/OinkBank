import { memo, VFC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { DocumentData, serverTimestamp } from "firebase/firestore";
import moment from "moment";
import { useAuthContext } from "../../contexts/AuthContext";
import useAddTransactions from "../../hooks/useAddTransactions";
import useEditChild from "../../hooks/useEditChild";
import useGetTotalAmount from "../../hooks/useGetTotalAmount";
import { v4 as uuidv4 } from "uuid";

interface Props {
  child: DocumentData;
}

export const ChildCard: VFC<Props> = memo(({ child }) => {
  const [isRegularDone, setIsRegularDone] = useState<boolean>(true);
  const [regularLastDate, setRegularLastDate] = useState<string>(
    child.lastDate
  );
  const stringToday = moment().format("YYYY-MM-DD");
  const { addTransaction } = useAddTransactions(child.id);
  const totalAmount = useGetTotalAmount(child.id);
  const mutation = useEditChild();
  const isRegular = true;
  const { currentUser } = useAuthContext();
  const addTransactionWeekly = async () => {
    const startWeeklyDate = moment(child.lastDate);
    const endWeeklyDate = moment().format("YYYY-MM-DD");
    let results: Array<string> = [];
    const current = startWeeklyDate.clone();
    const mondayInCurrentWeek = current
      .startOf("week")
      .add(1, "days")
      .format("YYYY-MM-DD");
    console.log(startWeeklyDate.format("d") === "0", { isRegularDone });
    if (startWeeklyDate.format("d") === "0") {
      results.push(mondayInCurrentWeek);
    }
    while (current.day(7 + 1).isSameOrBefore(endWeeklyDate)) {
      results.push(current.format("YYYY-MM-DD"));
    }
    if (currentUser && results.length > 0) {
      results.sort();
      results.map(async (result) => {
        await addTransaction({
          id: uuidv4(),
          created: serverTimestamp(),
          paymentDate: result,
          price: child.price,
          parent: currentUser.uid,
          child: child.id,
          isRegular,
        });
      });
      await mutation.mutate(child.id, {
        lastDate: moment().format("YYYY-MM-DD"),
      });
    }
    results = [];
    setIsRegularDone(true);
    setRegularLastDate(stringToday);
  };
  const addTransactionMonthly = async () => {
    const startMonthlyDate = moment(child.lastDate).startOf("month");
    const endMonthlyDate = moment().startOf("month").format("YYYY-MM-DD");
    let results = [];
    const current = startMonthlyDate.clone();
    while (current.isBefore(endMonthlyDate)) {
      current.add(1, "month");
      results.push(current.startOf("month").format("YYYY-MM-DD"));
    }
    if (currentUser && results && results.length > 0) {
      results.map(async (result) => {
        await addTransaction({
          id: uuidv4(),
          created: serverTimestamp(),
          paymentDate: result,
          price: child.price,
          parent: currentUser.uid,
          child: child.id,
          isRegular,
        });
      });
      await mutation.mutate(child.id, {
        lastDate: moment().format("YYYY-MM-DD"),
      });
    }
    results = [];
    setRegularLastDate(stringToday);
    setIsRegularDone(true);
  };

  useEffect(() => {
    if (regularLastDate !== stringToday) {
      setIsRegularDone(false);
    }
  }, [regularLastDate, stringToday]);

  useEffect(() => {
    if (isRegularDone === false) {
      if (child && child.isPaused === false) {
        if (child.isWeekly === true) {
          addTransactionWeekly();
        } else if (child.isWeekly === false) {
          addTransactionMonthly();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child.id, child.isPaused, child.isWeekly, isRegularDone]);

  const navigate = useNavigate();

  const handleCardOnClick = (
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>
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
      lastDate: moment().format("YYYY-MM-DD "),
      isPaused: !child.isPaused,
    });
  };

  const monday = 1;
  const today = moment().isoWeekday();
  let nextMonday;
  // if we haven't yet passed the day of the week that I need:

  if (today < monday) {
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
      <Row className="my-4">
        <Col
          xs={{ span: 12 }}
          md={{ span: 8, offset: 2 }}
          lg={{ span: 6, offset: 3 }}
        >
          <Card className="rounded-lg">
            <Card.Body>
              <Col
                md={{ span: 12 }}
                className="py-xs-2 px-xs-2 py-md-2 px-md-4 py-lg-3 px-lg-5"
              >
                <Row className="mb-2 name-edit-container justify-content-between">
                  <Col xs={{ span: 9 }}>
                    <h4 onClick={handleCardOnClick} className="hover-name">
                      {child.name}
                    </h4>
                  </Col>
                  <Col
                    xs={{ span: 2 }}
                    md={{ span: 1 }}
                    className="align-self-start edit-icon-container"
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      color="#rgb(23, 23, 77)"
                      size="lg"
                      onClick={handleEditOnClick}
                      className="hover-icon edit"
                    />
                  </Col>
                </Row>
                <Row className="mb-2 justify-content-between">
                  <Col xs={{ span: 5 }}>
                    <h5>Total</h5>
                  </Col>
                  <Col xs={{ span: 5 }}>
                    <h5 className="text-end">{totalAmount} kr</h5>
                  </Col>
                </Row>
                <Row className="mb-2 justify-content-between">
                  <Col xs={{ span: 5 }}>
                    {child.isWeekly ? <h6>Weekly</h6> : <h6>Monthly</h6>}
                  </Col>
                  <Col xs={{ span: 5 }}>
                    <h6 className="text-end">{child.price} kr</h6>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={{ span: 10 }} md={{ span: 7 }}>
                    {child.isPaused ? (
                      <h6 className="text-danger">Paused</h6>
                    ) : (
                      <h6>{`Next Allowance in ${diffDays} day(s) +${child.price} kr`}</h6>
                    )}
                  </Col>
                  <Col className="text-end">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handlePauseOnClick}
                      className="text-info"
                    >
                      {child.isPaused ? <>Restart ?</> : <>Pause</>}
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
