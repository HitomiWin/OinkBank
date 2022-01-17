import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  // query,
  // where,
  // orderBy,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";

const useAddTransactions = () => {
  const [error, setError] = useState<null | boolean>(null);
  const [isError, setIsError] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState<null | boolean>(null);
  const [isSuccess, setIsSuccess] = useState<null | boolean>(null);

  const addTransaction = async (
    id: string,
    isRegular: boolean,
    price: number,
    paymentDate: string
  ) => {
    setError(null);
    setIsError(null);
    setIsSuccess(null);
    setIsLoading(true);

    try {
      await addDoc(collection(db, "children", id, "transactions"), {
        created: serverTimestamp(),
        paymentDate,
        price,
        isRegular,
      });
      setIsSuccess(true);
      setIsLoading(false);
    } catch (e: any) {
      setError(e.message);
      setIsError(true);
      setIsLoading(false);
      setIsSuccess(false);
    }
  };

  return { error, isError, isLoading, isSuccess, addTransaction };
};

export default useAddTransactions;
