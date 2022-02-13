import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";

const useGetChild = (col: string, id: string) => {
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [isError, setIsError] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DocumentData | null>(null);

  const getDoc = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    // get document reference
    const ref = doc(db, col, id);

    // attach listener
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (!snapshot.exists()) {
          setData(null);
          setIsLoading(false);
          return;
        }

        setData(snapshot.data());
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsError(true);
        setIsLoading(false);
      }
    );
    return unsubscribe;
  };
  useEffect(() => {
    getDoc();
    return () => {
      setIsLoading(null);
      setIsError(null);
      setError(null);
      setData(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col, id]);

  return {
    isLoading,
    data,
    error,
    isError,
  };
};

export default useGetChild;
