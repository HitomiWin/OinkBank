import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { collection, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";

const useGetChildren = () => {
  const { currentUser } = useAuthContext();
  const colChildrenRef = collection(db, "children");
  const queryKey = ["children", currentUser?.uid];
  const queryRef = query(
    colChildrenRef,
    where("parent", "==", currentUser?.uid),
    orderBy("created", "desc")
  );
  const childrenQuery = useFirestoreQueryData(
    queryKey,
    queryRef,
    {
      subscribe: true,
    },
    {
      refetchOnMount: "always",
    }
  );

  return childrenQuery;
};

export default useGetChildren;
