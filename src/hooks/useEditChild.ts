import { useState } from "react";
import { doc, updateDoc, DocumentData } from "firebase/firestore";

import { db } from "../firebase";

const useEditChild = () => {
  const [error, setError] = useState<null | boolean>(null);
  const [isError, setIsError] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState<boolean | undefined>();
  const [isSuccess, setIsSuccess] = useState<null | boolean>(null);

  const mutate = async (id: string, childInfo: DocumentData) => {
    setError(null);
    setIsError(null);
    setIsSuccess(null);
    setIsLoading(true);

    try {
      await updateDoc(doc(db, "children", id), childInfo);
      setIsSuccess(true);
      setIsLoading(false);
    } catch (e: any) {
      setError(e.message);
      setIsError(true);
      setIsLoading(false);
      setIsSuccess(false);
    }
  };

  return { error, isError, isLoading, isSuccess, mutate };
};

export default useEditChild;
