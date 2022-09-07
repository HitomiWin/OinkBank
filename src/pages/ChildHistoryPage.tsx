import { useNavigate } from "react-router-dom";
import { ChildHistoryList } from "../components/lists/ChildHistoryList";
export const ChildHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex justify-content-start">
        <p className="back-button col-1" onClick={() => navigate(-1)}>
          Back
        </p>
      </div>
      <ChildHistoryList />
    </>
  );
};
