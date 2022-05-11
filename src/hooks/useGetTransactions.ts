import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const useGetTransactions = (id: string) => {
  const colTransactionsRef = collection(db, "children", id, "transactions");
  const queryKey = ["transactions", id];
  const queryRef = query(colTransactionsRef, orderBy("created", "desc"));
  const getTransactionsQuery = useFirestoreQuery(
    queryKey,
    queryRef,
    {
      subscribe: true,
    },
    {
      refetchOnMount: "always",
    }
  );

  return getTransactionsQuery;
};

export default useGetTransactions;
