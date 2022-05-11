import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { collection, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";

const useGetTransactions = (id: string) => {
  const { currentUser } = useAuthContext();
  const colTransactionsRef = collection(db, "transactions");
  const queryKey = ["transactions", id];
  const queryRef = query(
    colTransactionsRef,
    where("parent", "==", currentUser?.uid),
    where("child", "==", id),
    orderBy("created", "desc")
  );
  const getTransactionsQuery = useFirestoreQueryData(
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
