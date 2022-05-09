import useGetTransactions from "./useGetTransactions";
import { DocumentData } from "firebase/firestore";

const useGetTotalAmount = (id: string) => {
  const transactionsQuery = useGetTransactions(id);
  const transActions = transactionsQuery.data?.docs.map(
    (transaction: DocumentData) => transaction.data()
  );
  const priceArray = transActions?.map(({ price }) => price);
  if (priceArray && priceArray.length > 0) {
    const sum = priceArray.reduce((acc, current) => acc + current);
    return sum;
  } else return 0;
};

export default useGetTotalAmount;
