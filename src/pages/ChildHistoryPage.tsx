import { useNavigate } from "react-router-dom";
import { ChildHistoryList } from "../components/lists/ChildHistoryList";

export const ChildHistoryPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <p className="back-button" onClick={() => navigate(-1)}>
        Back
      </p>
      <ChildHistoryList />;
    </>
  );
};
