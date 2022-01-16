import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { Child } from "../shared/interfaces";
import { v4 as uuidv4 } from "uuid";

import { db } from "../firebase";

const useAddChild = () => {
  const [error, setError] = useState<null | boolean>(null);
  const [isError, setIsError] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState<boolean | undefined>();
  const [isSuccess, setIsSuccess] = useState<null | boolean>(null);
  const uuid: string = uuidv4();

  const addChild = async (childInfo: Child) => {
    setError(null);
    setIsError(null);
    setIsSuccess(null);
    setIsLoading(true);

    try {
      const ref = doc(db, "children", uuid);
      await setDoc(ref, childInfo);
      setIsSuccess(true);
      setIsLoading(false);
    } catch (e: any) {
      setError(e.message);
      setIsError(true);
      setIsLoading(false);
      setIsSuccess(false);
    }
  };

  return { error, isError, isLoading, isSuccess, addChild };
};

export default useAddChild;
