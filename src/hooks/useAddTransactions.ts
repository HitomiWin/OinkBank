import { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Transaction } from "../shared/interfaces";

const useAddTransactions = (id: string) => {
  const [error, setError] = useState<null | boolean>(null);
  const [isError, setIsError] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState<null | boolean>(null);
  const [isSuccess, setIsSuccess] = useState<null | boolean>(null);

  const addTransaction = async (transactionInfo: Transaction) => {
    setError(null);
    setIsError(null);
    setIsSuccess(null);
    setIsLoading(true);
    try {
      const ref = doc(db, "transactions", transactionInfo.id);
      await setDoc(ref, transactionInfo);
      setIsSuccess(true);
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
