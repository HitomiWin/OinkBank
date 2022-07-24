import { db } from "../firebase";
import { doc, DocumentData } from "firebase/firestore";
import { useFirestoreDocumentData } from "@react-query-firebase/firestore";

const useGetChild = (id: string) => {
  const ref = doc(db, "children", id);
  const child = useFirestoreDocumentData<DocumentData>(["children", id], ref);

  return child;
};

export default useGetChild;
