import React, {
  VFC,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import useGetChildren from "../hooks/useGetChildren";
import moment from "moment";
import useAddTransactions from "../hooks/useAddTransactions";

const ChildContext = createContext({});

const useChildContext = () => {
  return useContext(ChildContext);
};

interface Props {
  children: ReactNode;
}

const ChildContextProvider: VFC<Props> = ({ children }) => {
  const childrenQuery = useGetChildren();
  const { addTransaction } = useAddTransactions();

  const contextValues = {};
  return (
    <ChildContext.Provider value={contextValues}>
      {childrenQuery.isLoading && <p>loading...</p>}
      {!childrenQuery.isLoading && children}
    </ChildContext.Provider>
  );
};

export { useChildContext, ChildContextProvider as default };
